import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatTreeFlattener, MatTreeFlatDataSource} from '@angular/material';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { Position } from '../../shop/position';
import { Artikel } from '../../shop/item';

@Component({
  selector: 'app-dialog-all-datasheets',
  templateUrl: './dialog-all-datasheets.component.html',
  styleUrls: ['./dialog-all-datasheets.component.scss']
})
export class DialogAllDatasheetsComponent implements OnInit {
  dialog: any;
  downloadList: any[];
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  selectedParent: TodoItemFlatNode | null = null;
  newItemName = '';
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);


  constructor(private dialogRef: MatDialogRef<DialogAllDatasheetsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialog = dialogRef;
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
    this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = this.buildFileTree(data);
    this.treeControl.expandAll();
    this.selectAll();
  }

  ngOnInit() {

  }

  buildFileTree(obj: Position[]): TodoItemNode[] {
    const data: TodoItemNode[] = [];
    for (let posId = 0; posId < obj.length; posId++) {
      const posNode = new TodoItemNode();
      posNode.item = new NodeData(obj[posId].name, 'position');
      data.push(posNode);
      for (let prodId = 0; prodId < obj[posId].products.length; prodId++) {
        const prodNode = new TodoItemNode();
        prodNode.item = new NodeData(obj[posId].products[prodId].tab, 'product');
        posNode.children.push(prodNode);
        for (let itemId = 0; itemId < obj[posId].products[prodId].items.length; itemId++) {
          const artikel: Artikel = obj[posId].products[prodId].items[itemId].artikel;
          if (artikel.DS) {
            const dsNode = new TodoItemNode();
            dsNode.item = new NodeData(artikel.DS.split('/')[artikel.DS.split('/').length - 1], 'sheet', artikel.DS);
            prodNode.children.push(dsNode);
          }
          if (artikel.LDT) {
            const ldtNode = new TodoItemNode();
            ldtNode.item = new NodeData(artikel.LDT.split('/')[artikel.LDT.split('/').length - 1], 'sheet', artikel.LDT);
            prodNode.children.push(ldtNode);
          }
        }
      }
    }
    return data;
  }

  getLevel = (node: TodoItemFlatNode) => node.level;
  isExpandable = (node: TodoItemFlatNode) => node.expandable;
  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;
  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;
  isSheet = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item.className === 'sheet';
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = node.children.length ? true : false;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  selectAll() {
    for (let i = 0; i < this.dataSource.data.length; i++) {
      this.todoItemSelectionToggle(this.nestedNodeMap.get(this.dataSource.data[i]));
    }
  }

  prepareDownloadFiles() {
    this.downloadList = [];
    for (let i = 0; i < this.dataSource.data.length; i++) {
      this.traverseItemNodeAndAddDownloadList(this.dataSource.data[i]);
    }
  }

  traverseItemNodeAndAddDownloadList(node: TodoItemNode) {
    if (node.children.length) {
      for (let i = 0; i < node.children.length; i++) {
        this.traverseItemNodeAndAddDownloadList(node.children[i]);
      }
    } else if (node.item.className === 'sheet' && this.checklistSelection.isSelected(this.nestedNodeMap.get(node))) {
      this.downloadList.push(node.item.link);
    }
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
    this.prepareDownloadFiles();
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.prepareDownloadFiles();
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  download() {
    console.log(this.downloadList);
    // this.dialog.close();
  }
}

class NodeData {
  name: string;
  className: string;
  link: string;

  constructor (name: string, className: string, link?: string) {
    this.name = name;
    this.className = className;
    this.link = link;
  }
}

class TodoItemNode {
  children: TodoItemNode[] = [];
  item: NodeData;
}

class TodoItemFlatNode {
  item: NodeData;
  level: number;
  expandable: boolean;
}
