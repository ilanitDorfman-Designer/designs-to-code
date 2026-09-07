import type { Question } from '../interfaces';
import { getInnerQuestions, getOuterQuestions, isQuestionRequired } from './question-resolver.util';

const createInputQuestion = (id: string, validations: Question['validations'] = []): Question => ({
  id,
  type: 'input',
  inputType: 'text',
  placeholderText: 'Enter',
  validations,
});

describe('getInnerQuestions', () => {
  it('GIVEN valid IDs and allQuestions WHEN getInnerQuestions called THEN returns matching questions in ID order', () => {
    // GIVEN
    const allQuestions: Question[] = [createInputQuestion('q1'), createInputQuestion('q2'), createInputQuestion('q3')];
    const innerQuestionsIds = ['q3', 'q1', 'q2'];

    // WHEN
    const result = getInnerQuestions(innerQuestionsIds, allQuestions);

    // THEN
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('q3');
    expect(result[1].id).toBe('q1');
    expect(result[2].id).toBe('q2');
  });

  it('GIVEN empty IDs array WHEN getInnerQuestions called THEN returns empty array', () => {
    // GIVEN
    const allQuestions: Question[] = [createInputQuestion('q1')];
    const innerQuestionsIds: string[] = [];

    // WHEN
    const result = getInnerQuestions(innerQuestionsIds, allQuestions);

    // THEN
    expect(result).toEqual([]);
  });

  it('GIVEN undefined IDs WHEN getInnerQuestions called THEN returns empty array', () => {
    // GIVEN
    const allQuestions: Question[] = [createInputQuestion('q1')];

    // WHEN
    const result = getInnerQuestions(undefined as unknown as string[], allQuestions);

    // THEN
    expect(result).toEqual([]);
  });

  it('GIVEN non-existent IDs WHEN getInnerQuestions called THEN skips missing IDs', () => {
    // GIVEN
    const allQuestions: Question[] = [createInputQuestion('q1'), createInputQuestion('q2')];
    const innerQuestionsIds = ['q1', 'q99', 'q2', 'qMissing'];

    // WHEN
    const result = getInnerQuestions(innerQuestionsIds, allQuestions);

    // THEN
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('q1');
    expect(result[1].id).toBe('q2');
  });

  it('GIVEN empty allQuestions WHEN getInnerQuestions called THEN returns empty array', () => {
    // GIVEN
    const allQuestions: Question[] = [];
    const innerQuestionsIds = ['q1', 'q2'];

    // WHEN
    const result = getInnerQuestions(innerQuestionsIds, allQuestions);

    // THEN
    expect(result).toEqual([]);
  });

  it('GIVEN undefined allQuestions WHEN getInnerQuestions called THEN returns empty array', () => {
    // GIVEN
    const innerQuestionsIds = ['q1'];

    // WHEN
    const result = getInnerQuestions(innerQuestionsIds, undefined as unknown as Question[]);

    // THEN
    expect(result).toEqual([]);
  });
});

describe('getOuterQuestions', () => {
  it('GIVEN valid IDs and allQuestions WHEN getOuterQuestions called THEN returns matching questions in ID order', () => {
    // GIVEN
    const allQuestions: Question[] = [createInputQuestion('q1'), createInputQuestion('q2'), createInputQuestion('q3')];
    const outerQuestionsIds = ['q2', 'q1'];

    // WHEN
    const result = getOuterQuestions(outerQuestionsIds, allQuestions);

    // THEN
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('q2');
    expect(result[1].id).toBe('q1');
  });

  it('GIVEN empty IDs array WHEN getOuterQuestions called THEN returns empty array', () => {
    // GIVEN
    const allQuestions: Question[] = [createInputQuestion('q1')];
    const outerQuestionsIds: string[] = [];

    // WHEN
    const result = getOuterQuestions(outerQuestionsIds, allQuestions);

    // THEN
    expect(result).toEqual([]);
  });

  it('GIVEN undefined IDs WHEN getOuterQuestions called THEN returns empty array', () => {
    // GIVEN
    const allQuestions: Question[] = [createInputQuestion('q1')];

    // WHEN
    const result = getOuterQuestions(undefined as unknown as string[], allQuestions);

    // THEN
    expect(result).toEqual([]);
  });

  it('GIVEN non-existent IDs WHEN getOuterQuestions called THEN skips missing IDs', () => {
    // GIVEN
    const allQuestions: Question[] = [createInputQuestion('q1'), createInputQuestion('q2')];
    const outerQuestionsIds = ['q99', 'q1', 'qMissing'];

    // WHEN
    const result = getOuterQuestions(outerQuestionsIds, allQuestions);

    // THEN
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('q1');
  });

  it('GIVEN empty allQuestions WHEN getOuterQuestions called THEN returns empty array', () => {
    // GIVEN
    const allQuestions: Question[] = [];
    const outerQuestionsIds = ['q1'];

    // WHEN
    const result = getOuterQuestions(outerQuestionsIds, allQuestions);

    // THEN
    expect(result).toEqual([]);
  });

  it('GIVEN undefined allQuestions WHEN getOuterQuestions called THEN returns empty array', () => {
    // GIVEN
    const outerQuestionsIds = ['q1'];

    // WHEN
    const result = getOuterQuestions(outerQuestionsIds, undefined as unknown as Question[]);

    // THEN
    expect(result).toEqual([]);
  });
});

describe('isQuestionRequired', () => {
  it('GIVEN question with required validation WHEN isQuestionRequired called THEN returns true', () => {
    // GIVEN
    const question = createInputQuestion('q1', [{ required: true, errorMessage: 'Required' }]);

    // WHEN
    const result = isQuestionRequired(question);

    // THEN
    expect(result).toBe(true);
  });

  it('GIVEN question without required validation WHEN isQuestionRequired called THEN returns false', () => {
    // GIVEN
    const question = createInputQuestion('q1', [{ minlength: 3, errorMessage: 'Min 3' }]);

    // WHEN
    const result = isQuestionRequired(question);

    // THEN
    expect(result).toBe(false);
  });

  it('GIVEN question with empty validations WHEN isQuestionRequired called THEN returns false', () => {
    // GIVEN
    const question = createInputQuestion('q1', []);

    // WHEN
    const result = isQuestionRequired(question);

    // THEN
    expect(result).toBe(false);
  });

  it('GIVEN question with undefined validations WHEN isQuestionRequired called THEN returns false', () => {
    // GIVEN
    const question = {
      ...createInputQuestion('q1'),
      validations: undefined as unknown as Question['validations'],
    };

    // WHEN
    const result = isQuestionRequired(question);

    // THEN
    expect(result).toBe(false);
  });

  it('GIVEN question with required: false WHEN isQuestionRequired called THEN returns false', () => {
    // GIVEN - validation has 'required' key but value is false
    const question = createInputQuestion('q1', [{ required: false, errorMessage: 'Required' } as Question['validations'][0]]);

    // WHEN
    const result = isQuestionRequired(question);

    // THEN
    expect(result).toBe(false);
  });

  it('GIVEN undefined question WHEN isQuestionRequired called THEN returns false', () => {
    // GIVEN
    const question = undefined as unknown as Question;

    // WHEN
    const result = isQuestionRequired(question);

    // THEN
    expect(result).toBe(false);
  });
});
