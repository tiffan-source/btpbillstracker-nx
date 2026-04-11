import { CoreError } from '../errors/core.error';
import { failure, runWithResult, success, type Result } from './result';

describe('Result', () => {
  it('should preserve success payload type and value', () => {
    const result: Result<{ id: string }> = success({ id: 'x-1' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('x-1');
    }
  });

  it('should preserve failure metadata payload', () => {
    const result = failure('ERR_CODE', 'Message', { source: 'core' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('ERR_CODE');
      expect(result.error.metadata).toEqual({ source: 'core' });
    }
  });

  it('should map expected domain error using Result failure shape', async () => {
    class ExpectedError extends CoreError {
      constructor() {
        super('EXPECTED_ERROR', 'Expected domain error', { reason: 'validation' });
      }
    }

    const result = await runWithResult(
      async () => {
        throw new ExpectedError();
      },
      [ExpectedError],
      'fallback message',
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toEqual({
        code: 'EXPECTED_ERROR',
        message: 'Expected domain error',
        metadata: { reason: 'validation' },
      });
    }
  });

  it('should map unexpected errors to UNKNOWN_ERROR', async () => {
    const result = await runWithResult(
      async () => {
        throw new Error('Unexpected runtime issue');
      },
      [],
      'fallback message',
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('UNKNOWN_ERROR');
      expect(result.error.message).toBe('Unexpected runtime issue');
    }
  });
});
