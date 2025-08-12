import { jest } from '@jest/globals';

const mockSelect = jest.fn<() => Promise<any>>();
const mockInsert = jest.fn<(arg: any) => Promise<any>>();
const mockFrom = jest.fn<(table: string) => any>();

jest.mock('@supabase/supabase-js', () => ({
  __esModule: true,
  createClient: jest.fn(() => ({ from: mockFrom })),
}));

import { fetchPosts, addPost } from '../lib/supabaseService';

describe('fetchPosts', () => {
  beforeEach(() => {
    mockFrom.mockReset();
    mockSelect.mockReset();
  });

  it('returns posts on success', async () => {
    const posts = [{ id: 1, title: 'Test' }];
    mockFrom.mockReturnValueOnce({ select: mockSelect });
    mockSelect.mockResolvedValueOnce({ data: posts, error: null });

    const result = await fetchPosts();

    expect(result).toEqual(posts);
    expect(mockFrom).toHaveBeenCalledWith('posts');
    expect(mockSelect).toHaveBeenCalledWith('*');
  });

  it('throws on error', async () => {
    const error = new Error('fetch failed');
    mockFrom.mockReturnValueOnce({ select: mockSelect });
    mockSelect.mockResolvedValueOnce({ data: null, error });

    await expect(fetchPosts()).rejects.toThrow('fetch failed');
  });
});

describe('addPost', () => {
  beforeEach(() => {
    mockFrom.mockReset();
    mockInsert.mockReset();
  });

  it('returns inserted post on success', async () => {
    const newPost = { title: 'New Post' };
    const inserted = { id: 1, ...newPost };
    mockFrom.mockReturnValueOnce({ insert: mockInsert });
    mockInsert.mockResolvedValueOnce({ data: inserted, error: null });

    const result = await addPost(newPost);

    expect(result).toEqual(inserted);
    expect(mockFrom).toHaveBeenCalledWith('posts');
    expect(mockInsert).toHaveBeenCalledWith(newPost);
  });

  it('throws on error', async () => {
    const error = new Error('insert failed');
    const newPost = { title: 'New Post' };
    mockFrom.mockReturnValueOnce({ insert: mockInsert });
    mockInsert.mockResolvedValueOnce({ data: null, error });

    await expect(addPost(newPost)).rejects.toThrow('insert failed');
  });
});
