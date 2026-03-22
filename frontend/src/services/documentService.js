import api from './api';

export const uploadDocument = async (file, docType) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('docType', docType);
  const { data } = await api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getDocuments = async () => {
  const { data } = await api.get('/documents');
  return data;
};

export const getDocumentById = async (id) => {
  const { data } = await api.get(`/documents/${id}`);
  return data;
};

export const deleteDocument = async (id) => {
  const { data } = await api.delete(`/documents/${id}`);
  return data;
};

export const analyzeDocument = async (documentId, language = 'english') => {
  const { data } = await api.post(`/analysis/${documentId}`, { language });
  return data;
};

export const getAnalysis = async (documentId) => {
  const { data } = await api.get(`/analysis/${documentId}`);
  return data;
};

export const translateAnalysis = async (documentId, language) => {
  const { data } = await api.post(`/analysis/${documentId}/translate`, { language });
  return data;
};