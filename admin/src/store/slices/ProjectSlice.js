import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProjectService from "services/ProjectService";

// -------------------- Thunks --------------------

// Get all projects with pagination & search
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await ProjectService.getAllProjects(params);
      return res.data; // API response { data: [...], pagination: {...} }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Get project by ID
export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await ProjectService.getProjectById(projectId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create project
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const res = await ProjectService.createProject(projectData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const res = await ProjectService.updateProject(projectId, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async ({ projectId, updatedBy }, { rejectWithValue }) => {
    try {
      const res = await ProjectService.deleteProject(projectId, { updatedBy });
      return { projectId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// -------------------- Slice --------------------

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    list: [],
    selectedProject: null,
    loading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 0,
    },
  },
  reducers: {
    resetProjects: (state) => {
      state.list = [];
      state.selectedProject = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch project by ID
    builder
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Create project
    builder
      .addCase(createProject.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Update project
    builder
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.list.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Delete project
    builder
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload.projectId);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetProjects } = projectSlice.actions;
export default projectSlice.reducer;
