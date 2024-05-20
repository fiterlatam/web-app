import { YesnoPipe } from './yesno.pipe';

describe('YesnoPipe', () => {
  it('create an instance', () => {
    // @ts-ignore
    const pipe = new YesnoPipe();
    expect(pipe).toBeTruthy();
  });
});
