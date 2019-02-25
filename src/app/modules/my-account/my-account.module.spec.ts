import { GroutingModule } from './verguss.module';

describe('VergussModule', () => {
  let vergussModule: GroutingModule;

  beforeEach(() => {
    vergussModule = new GroutingModule();
  });

  it('should create an instance', () => {
    expect(vergussModule).toBeTruthy();
  });
});
