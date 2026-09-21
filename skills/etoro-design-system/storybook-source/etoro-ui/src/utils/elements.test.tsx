import type { ReactElement, ReactNode } from 'react';
import { forwardRef, memo } from 'react';

import { getChildrenByType } from './elements';

describe('getChildrenByType', () => {
  function Foo() {
    return null;
  }

  function Bar() {
    return null;
  }

  it('returns only matching component children', () => {
    const children: ReactNode[] = [<Foo key="foo" />, 'text', <Bar key="bar" />, null];

    const result = getChildrenByType(children, Foo);

    expect(result).toHaveLength(1);
    expect((result[0] as ReactElement).type).toBe(Foo);
  });

  it('preserves the original order of matching children', () => {
    const first = <Foo key="first" />;
    const second = <Foo key="second" />;
    const children: ReactNode[] = [first, second];

    const result = getChildrenByType(children, Foo);

    expect(result).toEqual([first, second]);
  });

  it('returns an empty array when no matches exist', () => {
    const children: ReactNode[] = [<Bar key="bar" />, 'text', null];

    const result = getChildrenByType(children, Foo);

    expect(result).toEqual([]);
  });

  it('matches memo-wrapped components', () => {
    const MemoFoo = memo(Foo);
    const children: ReactNode[] = [<MemoFoo key="memo-foo" />];

    const result = getChildrenByType(children, Foo);

    expect(result).toHaveLength(1);
    expect((result[0] as ReactElement).type).toBe(MemoFoo);
  });

  it('matches forwardRef-wrapped components', () => {
    const ForwardFoo = forwardRef(function ForwardFoo() {
      return null;
    });
    const children: ReactNode[] = [<ForwardFoo key="forward-foo" />];

    const result = getChildrenByType(children, ForwardFoo);

    expect(result).toHaveLength(1);
    expect((result[0] as ReactElement).type).toBe(ForwardFoo);
  });

  it('falls back to displayName/name when references differ', () => {
    function NamedComponent() {
      return null;
    }
    NamedComponent.displayName = 'NamedComponent';

    function AliasComponent() {
      return null;
    }
    AliasComponent.displayName = 'NamedComponent';

    const children: ReactNode[] = [<AliasComponent key="alias" />];

    const result = getChildrenByType(children, NamedComponent);

    expect(result).toHaveLength(1);
    expect((result[0] as ReactElement).type).toBe(AliasComponent);
  });
});
