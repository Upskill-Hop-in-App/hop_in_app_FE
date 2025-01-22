import { AttachedIconPipe } from './attached-icon.pipe';
import { TestBed } from '@angular/core/testing';

describe('AttachedIconPipe', () => {
  it('create an instance', () => {
    const pipe = TestBed.inject(AttachedIconPipe)
    expect(pipe).toBeTruthy();
  });
});
