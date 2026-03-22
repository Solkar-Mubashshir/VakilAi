import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDocuments, deleteDocument } from '../../services/documentService';
import { toast } from 'react-toastify';
import {
  Container, Box, Typography, Button, Grid, Chip,
  IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';

const STATUS_COLORS = {
  completed:  { bg: '#EDF7F1', color: '#1A7A4A', label: 'Analyzed' },
  processing: { bg: '#FEF3C7', color: '#D97706', label: 'Processing' },
  uploaded:   { bg: '#EEF2FF', color: '#4338CA', label: 'Uploaded' },
  failed:     { bg: '#FDEDED', color: '#C0392B', label: 'Failed' },
};

const DOC_TYPE_LABELS = {
  rent_agreement: '🏠 Rent Agreement',
  fir:            '🚔 FIR',
  court_notice:   '⚖️ Court Notice',
  employment:     '💼 Employment',
  nda:            '🔒 NDA',
  other:          '📄 Other',
};

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleteId, setDeleteId]   = useState(null);
  const [deleting, setDeleting]   = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await getDocuments();
        setDocuments(data.documents);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDocument(deleteId);
      setDocuments(docs => docs.filter(d => d._id !== deleteId));
      toast.success('Document deleted');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatSize = (bytes) => bytes ? `${(bytes / 1024).toFixed(0)} KB` : '—';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: 'var(--gold)' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'var(--cream)', minHeight: '90vh', py: 5 }}>
      <Container maxWidth="lg">

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'var(--navy)', fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 0.5 }}>
              My Documents
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--slate)' }}>
              {documents.length} document{documents.length !== 1 ? 's' : ''} analyzed
            </Typography>
          </Box>
          <Button
            component={Link} to="/upload"
            variant="contained" startIcon={<AddIcon />}
            sx={{ bgcolor: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, '&:hover': { bgcolor: 'var(--gold-lt)' } }}
          >
            Analyze New Document
          </Button>
        </Box>

        {documents.length === 0 ? (
          <Box className="vk-card" sx={{ textAlign: 'center', py: 8 }}>
            <DescriptionIcon sx={{ fontSize: 64, color: 'var(--muted)', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--navy)', mb: 1 }}>
              No documents yet
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--muted)', mb: 3 }}>
              Upload your first legal document to get started
            </Typography>
            <Button
              component={Link} to="/upload" variant="contained"
              sx={{ bgcolor: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, '&:hover': { bgcolor: 'var(--gold-lt)' } }}
            >
              Upload Document
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {documents.map((doc, i) => {
              const status = STATUS_COLORS[doc.status] || STATUS_COLORS.uploaded;
              return (
                <Grid item xs={12} sm={6} lg={4} key={doc._id}>
                  <Box
                    className="vk-card fade-in-up"
                    style={{ animationDelay: `${i * 0.06}s` }}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%' }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flex: 1, minWidth: 0 }}>
                        <Box sx={{ bgcolor: 'rgba(201,168,76,0.12)', p: 1, borderRadius: 2, flexShrink: 0 }}>
                          <DescriptionIcon sx={{ color: 'var(--gold)', fontSize: 22 }} />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
                            {doc.originalName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'var(--muted)' }}>
                            {formatSize(doc.fileSize)} · {formatDate(doc.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={status.label} size="small"
                        sx={{ bgcolor: status.bg, color: status.color, fontWeight: 600, fontSize: '0.7rem', height: 24 }}
                      />
                    </Box>

                    <Typography variant="caption" sx={{ color: 'var(--slate)', fontWeight: 500 }}>
                      {DOC_TYPE_LABELS[doc.docType] || '📄 Document'}
                    </Typography>

                    {doc.status === 'completed' && doc.analysis?.riskScore !== undefined && (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ color: 'var(--slate)' }}>Risk Score</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: doc.analysis.riskScore > 60 ? 'var(--red)' : doc.analysis.riskScore > 30 ? '#D97706' : 'var(--green)' }}>
                            {doc.analysis.riskScore}/100
                          </Typography>
                        </Box>
                        <div className="risk-meter">
                          <div className="risk-meter-fill" style={{
                            width: `${doc.analysis.riskScore}%`,
                            background: doc.analysis.riskScore > 60 ? 'var(--red)' : doc.analysis.riskScore > 30 ? '#D97706' : 'var(--green)',
                          }} />
                        </div>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 1, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      <Button
                        component={Link} to={`/documents/${doc._id}`}
                        size="small" startIcon={<VisibilityIcon />}
                        sx={{ color: 'var(--navy)', fontWeight: 600, '&:hover': { color: 'var(--gold)' } }}
                      >
                        View
                      </Button>
                      <Tooltip title="Delete document">
                        <IconButton size="small" onClick={() => setDeleteId(doc._id)} sx={{ color: 'var(--muted)', '&:hover': { color: 'var(--red)' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontFamily: 'var(--font-head)', fontWeight: 700 }}>Delete Document?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'var(--slate)' }}>
            This will permanently delete the document and its analysis. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={deleting}>
            {deleting ? <CircularProgress size={18} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentsPage;