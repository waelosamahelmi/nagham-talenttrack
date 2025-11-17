import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate } from '../types';

interface CandidatesState {
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
  loading: boolean;
  searchQuery: string;
}

const initialState: CandidatesState = {
  candidates: [],
  selectedCandidate: null,
  loading: false,
  searchQuery: '',
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    setCandidates: (state, action: PayloadAction<Candidate[]>) => {
      state.candidates = action.payload;
    },
    setSelectedCandidate: (state, action: PayloadAction<Candidate | null>) => {
      state.selectedCandidate = action.payload;
    },
    updateCandidateStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const candidate = state.candidates.find(c => c.id === action.payload.id);
      if (candidate) {
        candidate.status = action.payload.status as any;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setCandidates, setSelectedCandidate, updateCandidateStatus, setLoading, setSearchQuery } = candidatesSlice.actions;
export default candidatesSlice.reducer;