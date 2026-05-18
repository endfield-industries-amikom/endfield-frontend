import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import type { IProduct } from "~/interfaces/IProduct";
import { useNavigate } from "react-router";

export default function ProductCard({ ...data }: IProduct) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        width: "12vw",
        minWidth: "12vw",
        height: "18vw",
        border: "0.1vw solid #C2C2C2",
        bgcolor: "#CFCFCF",
        borderRadius: 1,
        overflow: "hidden",
        boxShadow: 1,
        transition: "transform 250ms ease, box-shadow 250ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={() => navigate(`/products`)}
      >
        {data.isBest && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "5vw",
              height: "2vw",
              borderBottomRightRadius: 1,
              bgcolor: "#C2C2C2",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{ fontSize: { xs: "0.8vw", lg: "0.5vw" }, fontWeight: 500 }}
            >
              Best Seller
            </Typography>
          </Box>
        )}
        {!data.image ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "20vw",
            }}
          >
            <Typography
              sx={{ fontSize: { xs: "1.2vw", md: "0.8vw", lg: "0.8vw" } }}
            >
              {data.title}
            </Typography>
          </Box>
        ) : (
          <CardMedia
            component="img"
            image={data.image}
            alt={data.title}
            sx={{ width: "100%", height: "20vw", objectFit: "cover" }}
          />
        )}

        <CardContent
          sx={{
            mt: "auto",
            width: "100%",
            height: "10vw",
            bgcolor: "#fff",
            p: "1vw",
            display: "flex",
            flexDirection: "column",
            gap: "0.5vw",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <Typography
            sx={{ fontSize: { xs: "1.2vw", md: "1vw", lg: "0.8vw" } }}
            noWrap
          >
            {data.title}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1.5vw", md: "1vw", lg: "1vw" },
              fontWeight: 700,
            }}
          >
            ${data.price}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1vw", md: "0.8vw", lg: "1vw" },
                transition: "font-weight 150ms ease",
                "&:hover": { fontWeight: 700 },
              }}
            >
              ...
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
