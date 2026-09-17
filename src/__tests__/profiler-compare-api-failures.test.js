import { describe, expect, it, vi } from 'vitest';
import { compareWallets } from '../cli.js';

const A = '0x0000000000000000000000000000000000000001';
const B = '0x0000000000000000000000000000000000000002';

describe('profiler compare API failures', () => {
  it('propagates a counterparty request failure instead of returning empty overlap', async () => {
    const failure = new Error('rate limited');
    const api = {
      addressCounterparties: vi.fn()
        .mockRejectedValueOnce(failure)
        .mockResolvedValueOnce({ data: [] }),
      addressBalance: vi.fn(),
    };

    await expect(compareWallets(api, {
      addresses: [A, B],
      chain: 'ethereum',
      delayMs: 0,
    })).rejects.toBe(failure);

    expect(api.addressBalance).not.toHaveBeenCalled();
  });

  it('propagates a balance request failure instead of reporting a zero balance', async () => {
    const failure = new Error('service unavailable');
    const api = {
      addressCounterparties: vi.fn().mockResolvedValue({ data: [] }),
      addressBalance: vi.fn()
        .mockRejectedValueOnce(failure)
        .mockResolvedValueOnce({ data: [] }),
    };

    await expect(compareWallets(api, {
      addresses: [A, B],
      chain: 'ethereum',
      delayMs: 0,
    })).rejects.toBe(failure);
  });
});
