import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function Blog() {
  const [activeTab, setTab] = useState(0);

  return (
    <Box sx={{ bgcolor: "#f8f8f8", minHeight: "100vh", pb: 5 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero */}
        <Box
          sx={{
            position: "relative",
            borderRadius: 3,
            overflow: "hidden",
            mb: 5,
          }}
        >
          <img
            src="/HeroSection.png"
            alt="Hero"
            style={{
              width: "100%",
              height: 450,
              objectFit: "cover",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: 60,
              transform: "translateY(-50%)",
              color: "white",
              maxWidth: 500,
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Berita dan Informasi
            </Typography>

            <Typography>
              Membangun Kepercayaan Masyarakat kepada Telkom melalui Transparansi
              dan Keterbukaan Informasi.
            </Typography>
          </Box>
        </Box>


        <Tabs
          value={activeTab}
          onChange={(e, v) => setTab(v)}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 5 }}
        >
          <Tab label="Berita" />
          <Tab label="Artikel" />
          <Tab label="Panduan Logo" />
        </Tabs>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            color: "#202020",
          }}
        >
          NEWS
        </Typography>

        <Typography sx={{ mt: 1, mb: 4 }}>
          Cari informasi tentang Telkom yang Anda perlukan menggunakan filter
          ini.
        </Typography>

        {/* Filter */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "2fr 1fr 1fr 2fr",
            },
            gap: 2,
            mb: 5,
          }}
        >
          <TextField select label="Category" defaultValue="">
            <MenuItem value="">All</MenuItem>
          </TextField>

          <TextField select label="Year" defaultValue="">
            <MenuItem value="">2025</MenuItem>
            <MenuItem value="">2024</MenuItem>
          </TextField>

          <TextField select label="Month" defaultValue="">
            <MenuItem value="">January</MenuItem>
            <MenuItem value="">February</MenuItem>
          </TextField>

          <TextField
            fullWidth
            placeholder="Search..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Card */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3,1fr)",
            },
            gap: 3,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} sx={{ borderRadius: 3 }}>
              <CardMedia
                component="img"
                height="220"
                image="/HeroSection.png"
              />

              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Judul Berita
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Ringkasan berita ditampilkan di sini...
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}