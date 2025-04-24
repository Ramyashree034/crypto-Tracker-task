import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCryptoData = createAsyncThunk('crypto/fetchCryptoData', async () => {
  const response = await axios.get(
    'https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 5,
        page: 1,
        sparkline: true,
        price_change_percentage: '1h,24h,7d'
      }
    }
  );
  return response.data;
});

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    coins: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coins = action.payload;
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});


export default cryptoSlice.reducer;