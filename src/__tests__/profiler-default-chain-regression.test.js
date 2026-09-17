import { beforeEach, describe, expect, it, vi } from 'vitest';

const ensMocks = vi.hoisted(() => ({
  resolveAddress: vi.fn(async (name) => ({
    address: '0x0000000000000000000000000000000000000001',
    ensName: name,
  })),
  isEnsName: vi.fn(name => typeof name === 'string' && name.endsWith('.eth')),
}));

vi.mock('../ens.js', () => ({
  resolveAddress: ensMocks.resolveAddress,
  isEnsName: ensMocks.isEnsName,
}));

import { buildCommands } from '../cli.js';

describe('profiler per-command chain defaults', () => {
  beforeEach(() => vi.clearAllMocks());

  it('leaves chain unset so non-balance endpoints keep their own defaults', async () => {
    const api = { addressLabels: vi.fn().mockResolvedValue({ data: [] }) };
    await buildCommands({})['profiler'](
      ['labels'], api, {},
      { address: '0x0000000000000000000000000000000000000001' },
    );
    expect(api.addressLabels).toHaveBeenCalledWith(expect.objectContaining({ chain: undefined }));
  });

  it('lets ENS resolution use its ethereum default when chain is omitted', async () => {
    const api = { addressLabels: vi.fn().mockResolvedValue({ data: [] }) };
    await buildCommands({})['profiler'](['labels'], api, {}, { address: 'vitalik.eth' });
    expect(ensMocks.resolveAddress).toHaveBeenCalledWith('vitalik.eth', undefined);
    expect(api.addressLabels).toHaveBeenCalledWith(expect.objectContaining({
      address: '0x0000000000000000000000000000000000000001',
      chain: undefined,
    }));
  });

  it('still forwards an explicit chain', async () => {
    const api = { addressLabels: vi.fn().mockResolvedValue({ data: [] }) };
    await buildCommands({})['profiler'](['labels'], api, {}, { address: 'vitalik.eth', chain: 'base' });
    expect(ensMocks.resolveAddress).toHaveBeenCalledWith('vitalik.eth', 'base');
    expect(api.addressLabels).toHaveBeenCalledWith(expect.objectContaining({ chain: 'base' }));
  });
});
