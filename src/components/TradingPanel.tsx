import { Box, Button, FormControl, Paper, Select, TextField, Typography, InputLabel, MenuItem, Alert } from '@mui/material';
import { useState } from 'react';
import { TradeDirection } from '../types';
import { TraderConfig } from '../config/traders';
import { formatNumber } from '../utils/tradeUtils';

interface TradingPanelProps {
  onTrade: (trader: string, direction: TradeDirection, price: number, quantity: number) => void;
  traders: TraderConfig[];
}

const TradingPanel = ({ onTrade, traders }: TradingPanelProps) => {
  const [trader, setTrader] = useState(traders[0]?.id || '');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const handleTrade = (direction: TradeDirection) => {
    if (!price || !quantity) {
      setError('请填写价格和数量');
      return;
    }

    const priceNum = Number(price);
    const quantityNum = Number(quantity);

    if (priceNum <= 0) {
      setError('价格必须大于0');
      return;
    }

    if (quantityNum <= 0) {
      setError('数量必须大于0');
      return;
    }

    if (!Number.isInteger(quantityNum)) {
      setError('数量必须为整数');
      return;
    }

    onTrade(trader, direction, priceNum, quantityNum);
    setPrice('');
    setQuantity('');
    setError('');
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>交易面板</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>选择交易员</InputLabel>
          <Select
            value={trader}
            label="选择交易员"
            onChange={(e) => setTrader(e.target.value)}
          >
            {traders.map(t => (
              <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          label="价格"
          type="number"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          inputProps={{ step: '0.01', min: '0' }}
          helperText={price ? `当前价格: ${formatNumber(Number(price))}` : '请输入价格'}
        />

        <TextField
          label="数量"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          inputProps={{ step: '1', min: '1' }}
          helperText={quantity ? `当前数量: ${quantity}` : '请输入数量'}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={() => handleTrade('LONG')}
            disabled={!price || !quantity}
          >
            开仓做多
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="error"
            size="large"
            onClick={() => handleTrade('SHORT')}
            disabled={!price || !quantity}
          >
            开仓做空
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default TradingPanel;