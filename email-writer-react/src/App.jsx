import { useState } from 'react'
import './App.css'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Card,
  CardContent,
  Divider,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false); // ✅ New state for copy feedback

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate email reply. Please try again');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0f7fa, #e3f2fd)",
        p: 2
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: 6,
            overflow: "hidden",
            background: "white"
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold", textAlign: "center", color: "#1976d2" }}
            >
              ✉️ Email Reply Generator
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              label="Original Email Content"
              value={emailContent || ''}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Tone (Optional)</InputLabel>
              <Select
                value={tone || ''}
                label="Tone (Optional)"
                onChange={(e) => setTone(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!emailContent || loading}
              fullWidth
              sx={{
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "30px",
                background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                '&:hover': {
                  background: "linear-gradient(135deg, #1565c0, #1e88e5)"
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "✨ Generate Reply"}
            </Button>

            {error && (
              <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
                {error}
              </Typography>
            )}

            {generatedReply && (
              <Paper
                elevation={3}
                sx={{
                  mt: 4,
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: "#f9f9f9"
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "#1976d2" }}
                >
                  Generated Reply:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  variant="outlined"
                  value={generatedReply || ''}
                  inputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />

                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "25px",
                    textTransform: "none",
                    fontWeight: "bold"
                  }}
                  onClick={handleCopy}
                >
                  {copied ? "✅ Copied!" : "📋 Copy to Clipboard"}
                </Button>
              </Paper>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default App;
