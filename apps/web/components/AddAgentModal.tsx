'use client';

import * as React from 'react';
import {  
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import type { Address } from 'viem';
import { getAddress } from 'viem';
import {
  createAgentWithWalletForEOA,
  createAgentWithWalletForAA,
  getCounterfactualAAAddressByAgentName,
} from '@agentic-trust/core/client';
import { useWeb3Auth } from './Web3AuthProvider';
import { useWallet } from './WalletProvider';
import { ensureWeb3AuthChain } from '@/lib/web3auth';
import { CHAIN_CONFIGS, getChainConfigByHex } from '../config/chains';

type Props = {
  open: boolean;
  onClose: () => void;
  onAgentIndexed?: (agentName: string) => void;
};

type CreateStatus = { message: string; variant: 'info' | 'success' | 'error' };

const DEFAULT_CHAIN_ID = CHAIN_CONFIGS[0]?.chainId ?? 11155111;
const DEFAULT_CHAIN_HEX = CHAIN_CONFIGS[0]?.chainIdHex ?? '0xaa36a7';
const DEFAULT_ENS_ORG = '8004-agent';

async function fetchAdminAddress(): Promise<string | null> {
  try {
    const res = await fetch('/api/admin/address');
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    return (data?.address as string) || null;
    } catch {
      return null;
    }
}

async function computeServerAaAddress(agentName: string, chainId?: number) {
  const res = await fetch('/api/accounts/counterfactual-account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentName, chainId }),
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.message || payload?.error || 'Failed to compute AA address');
  }
  const data = await res.json();
  return data?.address as string;
}

async function checkEnsAvailability(fullName: string, chainId: number) {
  const encoded = encodeURIComponent(fullName);
  const res = await fetch(`/api/names/${encoded}?chainId=${chainId}`);
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  return typeof data?.available === 'boolean' ? data.available : null;
}

export function AddAgentModal({ open, onClose, onAgentIndexed }: Props) {
  const { provider: web3AuthProvider } = useWeb3Auth() || {};
  const { connected, address: walletAddress, eip1193Provider, privateKeyMode } = useWallet();

  const [selectedChainHex, setSelectedChainHex] = React.useState<string>(DEFAULT_CHAIN_HEX);
  const [agentName, setAgentName] = React.useState('');
  const [agentAccount, setAgentAccount] = React.useState<string>('');
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState('');
  const [agentUrl, setAgentUrl] = React.useState('');
  const [useAA, setUseAA] = React.useState(false);
  const [createEnsName, setCreateEnsName] = React.useState(false);
  const [ensOrgName, setEnsOrgName] = React.useState(DEFAULT_ENS_ORG);
  const [aaComputing, setAaComputing] = React.useState(false);
  const [ensAvailability, setEnsAvailability] = React.useState<boolean | null>(null);
  const [status, setStatus] = React.useState<CreateStatus | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [adminAddress, setAdminAddress] = React.useState<string | null>(null);

  const selectedChain = React.useMemo(() => getChainConfigByHex(selectedChainHex) ?? CHAIN_CONFIGS[0], [selectedChainHex]);

  React.useEffect(() => {
    if (!selectedChain) return;
    const nextEnsOrg = selectedChain.ensOrgName ?? DEFAULT_ENS_ORG;
    setEnsOrgName(nextEnsOrg);
  }, [selectedChain]);

  React.useEffect(() => {
    if (!privateKeyMode) return;
    fetchAdminAddress().then(setAdminAddress).catch(() => setAdminAddress(null));
  }, [privateKeyMode]);

  React.useEffect(() => {
    if (!open) {
      setAgentName('');
      setDescription('');
      setImage('');
      setAgentUrl('');
      setUseAA(false);
      setCreateEnsName(false);
      setEnsAvailability(null);
      setStatus(null);
      setSelectedChainHex(DEFAULT_CHAIN_HEX);
      return;
    }
    
    const defaultAccount = walletAddress || adminAddress;
    if (!useAA && defaultAccount) {
      setAgentAccount(defaultAccount);
    }
  }, [open, walletAddress, adminAddress, useAA]);

	React.useEffect(() => {
    if (!useAA || !agentName.trim()) {
      setEnsAvailability(null);
      return;
    }
    const controller = new AbortController();
    const run = async () => {
      try {
        const available = await checkEnsAvailability(agentName.trim(), selectedChain?.chainId ?? DEFAULT_CHAIN_ID);
        if (!controller.signal.aborted) setEnsAvailability(available);
      } catch {
        if (!controller.signal.aborted) setEnsAvailability(null);
      }
    };
    run();
    return () => controller.abort();
  }, [agentName, useAA, selectedChain]);

  React.useEffect(() => {
    if (!useAA) return;
    const trimmed = agentName.trim();
    if (!trimmed) {
      setAgentAccount('');
      return;
    }
    let cancelled = false;
    setAaComputing(true);
    (async () => {
      try {
        let computed: string;
        if (privateKeyMode) {
          computed = await computeServerAaAddress(trimmed, selectedChain?.chainId);
        } else {
          if (!eip1193Provider || !walletAddress) {
            throw new Error('Wallet required to compute AA address');
          }
          computed = await getCounterfactualAAAddressByAgentName(trimmed, walletAddress as Address, {
            ethereumProvider: eip1193Provider,
            chain: selectedChain?.viemChain,
          });
        }
        if (!cancelled) setAgentAccount(getAddress(computed));
      } catch (error: any) {
            if (!cancelled) {
          setStatus({ message: error?.message || 'Failed to compute AA address', variant: 'error' });
          setAgentAccount('');
        }
      } finally {
        if (!cancelled) setAaComputing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [agentName, useAA, privateKeyMode, eip1193Provider, walletAddress, selectedChain]);

  const ensureProviderOnChain = React.useCallback(
    async (chainHex: string) => {
      if (!eip1193Provider) return false;
      try {
        await ensureWeb3AuthChain(parseInt(chainHex, 16));
        return true;
      } catch (error) {
        console.warn('Failed to ensure provider chain', error);
        return false;
      }
    },
    [eip1193Provider],
  );

  const handleCreate = async () => {
    if (!agentName.trim()) {
      setStatus({ message: 'Agent name is required', variant: 'error' });
      return;
    }
    if (!agentAccount || !agentAccount.startsWith('0x')) {
      setStatus({ message: 'Agent account is required', variant: 'error' });
          return;
        }

    try {
      setSubmitting(true);
      setStatus({ message: 'Submitting...', variant: 'info' });
      const chainId = selectedChain?.chainId ?? DEFAULT_CHAIN_ID;
      const chainHex = selectedChain?.chainIdHex ?? DEFAULT_CHAIN_HEX;

      if (!privateKeyMode) {
        const providerReady = await ensureProviderOnChain(chainHex);
        if (!providerReady) throw new Error('Unable to switch wallet to selected chain');
      }

      const agentData = {
        agentName: agentName.trim(),
        agentAccount: getAddress(agentAccount),
        description: description || undefined,
        image: image || undefined,
        agentUrl: agentUrl || undefined,
      };

      if (privateKeyMode) {
        const endpoint = useAA ? '/api/agents/create-for-aa-pk' : '/api/agents/create-for-eoa-pk';
        const res = await fetch(endpoint, {
            method: 'POST',
          headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            ...agentData,
            chainId,
            ensOptions: {
              enabled: useAA && createEnsName,
              orgName: createEnsName ? ensOrgName : undefined,
            },
            }),
          });
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload?.message || payload?.error || 'Failed to create agent');
        }
        const data = await res.json();
        setStatus({ message: `Agent creation submitted. tx: ${data?.txHash ?? 'N/A'}`, variant: 'success' });
      } else if (useAA) {
        const result = await createAgentWithWalletForAA({
          agentData,
          account: walletAddress as Address,
          ethereumProvider: eip1193Provider,
          chainId,
          ensOptions: {
            enabled: createEnsName,
            orgName: createEnsName ? ensOrgName : undefined,
          },
          onStatusUpdate: (msg) => setStatus({ message: msg, variant: 'info' }),
        });
        setStatus({
          message: result.agentId
            ? `Agent ${result.agentId} created (tx ${result.txHash})`
            : `Agent creation submitted (tx ${result.txHash})`,
          variant: 'success',
        });
      } else {
        const result = await createAgentWithWalletForEOA({
          agentData,
          account: walletAddress as Address,
          ethereumProvider: eip1193Provider,
          chainId,
          onStatusUpdate: (msg) => setStatus({ message: msg, variant: 'info' }),
        });
        setStatus({
          message: result.agentId
            ? `Agent ${result.agentId} created (tx ${result.txHash})`
            : `Agent creation submitted (tx ${result.txHash})`,
          variant: 'success',
        });
      }

      onAgentIndexed?.(agentName.trim());
      setTimeout(() => onClose(), 500);
    } catch (error: any) {
      setStatus({ message: error?.message || 'Failed to create agent', variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Create Agent</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="chain-select-label">Chain</InputLabel>
            <Select
              labelId="chain-select-label"
              value={selectedChainHex}
              label="Chain"
              onChange={(event) => setSelectedChainHex(event.target.value)}
            >
              {CHAIN_CONFIGS.map((cfg) => (
                <MenuItem key={cfg.chainIdHex} value={cfg.chainIdHex}>
                  {cfg.chainName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Agent Name"
            value={agentName}
            onChange={(event) => setAgentName(event.target.value)}
            required
            fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={useAA}
                onChange={(event) => {
                  setUseAA(event.target.checked);
                  if (!event.target.checked && (walletAddress || adminAddress)) {
                    setAgentAccount(walletAddress || adminAddress || '');
                  }
                }}
              />
            }
            label="Use Account Abstraction"
          />

          <TextField 
            label="Agent Account"
            value={agentAccount}
            onChange={(event) => setAgentAccount(event.target.value)}
            fullWidth
            disabled={useAA}
            helperText={useAA ? (aaComputing ? 'Computing AA address...' : 'Computed from agent name') : '0x address that controls the agent'}
          />

          <TextField 
            label="Description"
            value={description} 
            onChange={(event) => setDescription(event.target.value)}
            fullWidth 
            multiline
            rows={3}
          />

          <TextField 
            label="Image URL"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            fullWidth 
          />

          <TextField
            label="Agent URL"
            value={agentUrl}
            onChange={(event) => setAgentUrl(event.target.value)}
            fullWidth
          />

          {useAA && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={createEnsName}
                  onChange={(event) => setCreateEnsName(event.target.checked)}
                />
              }
              label="Create ENS subdomain"
            />
          )}

          {useAA && createEnsName && (
            <TextField
              label="ENS Org Name"
              value={ensOrgName}
              fullWidth
              InputProps={{ readOnly: true }}
              helperText="Parent ENS domain (per chain configuration)"
            />
          )}

          {ensAvailability !== null && (
            <Typography variant="body2" color={ensAvailability ? 'success.main' : 'error.main'}>
              {ensAvailability ? 'ENS name is available' : 'ENS name is taken'}
                        </Typography>
          )}

          {status && (
            <Typography variant="body2" color={status.variant === 'error' ? 'error.main' : status.variant === 'success' ? 'success.main' : 'text.secondary'}>
              {status.message}
                        </Typography>
          )}
                      </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleCreate}
          variant="contained" 
          disabled={submitting || (useAA && (!agentAccount || aaComputing))}
        >
          {submitting ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


