import { getNextSortState, isEtTableColumnMarkedNonSortable, isEtTableColumnSortable } from '../sort-utils';

describe('isEtTableColumnMarkedNonSortable', () => {
  it('GIVEN sortable false WHEN checked THEN returns true', () => {
    expect(isEtTableColumnMarkedNonSortable({ name: 'buyPrice', title: 'Buy', sortable: false })).toBe(true);
  });

  it('GIVEN default column WHEN checked THEN returns false', () => {
    expect(isEtTableColumnMarkedNonSortable({ name: 'change', title: 'Change' })).toBe(false);
  });
});

describe('isEtTableColumnSortable', () => {
  it('GIVEN sortable false WHEN checked THEN returns false even if sort is enabled', () => {
    expect(isEtTableColumnSortable({ name: 'buyPrice', title: 'Buy', sortable: false }, true)).toBe(false);
  });

  it('GIVEN sort disabled WHEN checked THEN returns false', () => {
    expect(isEtTableColumnSortable({ name: 'change', title: 'Change' }, false)).toBe(false);
  });

  it('GIVEN default column WHEN sort enabled THEN returns true', () => {
    expect(isEtTableColumnSortable({ name: 'change', title: 'Change' }, true)).toBe(true);
  });
});

describe('getNextSortState', () => {
  it('returns desc when current is null', () => {
    expect(getNextSortState(null, 'price')).toEqual({ column: 'price', direction: 'desc' });
  });

  it('returns desc when pressing a different column', () => {
    const current = { column: 'name', direction: 'asc' as const };
    expect(getNextSortState(current, 'price')).toEqual({ column: 'price', direction: 'desc' });
  });

  it('cycles desc to asc for the same column', () => {
    const current = { column: 'price', direction: 'desc' as const };
    expect(getNextSortState(current, 'price')).toEqual({ column: 'price', direction: 'asc' });
  });

  it('cycles asc to null for the same column', () => {
    const current = { column: 'price', direction: 'asc' as const };
    expect(getNextSortState(current, 'price')).toBeNull();
  });

  it('full cycle: null -> desc -> asc -> null', () => {
    const step1 = getNextSortState(null, 'col');
    expect(step1).toEqual({ column: 'col', direction: 'desc' });

    const step2 = getNextSortState(step1, 'col');
    expect(step2).toEqual({ column: 'col', direction: 'asc' });

    const step3 = getNextSortState(step2, 'col');
    expect(step3).toBeNull();
  });
});
