import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterOptions } from '../types';

interface FiltersState {
  filters: Partial<FilterOptions>;
  isFilterOpen: boolean;
}

const initialState: FiltersState = {
  filters: {},
  isFilterOpen: false,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FilterOptions>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    toggleFilterPanel: (state) => {
      state.isFilterOpen = !state.isFilterOpen;
    },
  },
});

export const { setFilters, clearFilters, toggleFilterPanel } = filtersSlice.actions;
export default filtersSlice.reducer;