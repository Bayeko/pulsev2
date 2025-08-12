import { jest } from '@jest/globals';

const getSessionMock: any = jest.fn();

jest.mock('../lib/supabase', () => ({
  supabase: { auth: { getSession: getSessionMock } },
}));

import { getAuthSession } from '../lib/authSession';

describe('getAuthSession', () => {
  beforeEach(() => {
    getSessionMock.mockReset();
  });

  it('returns session data when available', async () => {
    const session = { user: { id: '1' } } as any;
    getSessionMock.mockResolvedValue({ data: { session }, error: null });

    const result = await getAuthSession();
    expect(result).toEqual(session);
    expect(getSessionMock).toHaveBeenCalled();
  });

  it('throws when supabase returns an error', async () => {
    const error = new Error('fail');
    getSessionMock.mockResolvedValue({ data: { session: null }, error });

    await expect(getAuthSession()).rejects.toThrow('fail');
  });
});
