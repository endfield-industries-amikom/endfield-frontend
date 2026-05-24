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

type ProductCardLayout = "carousel" | "grid";

interface ProductCardProps extends IProduct {
  layout?: ProductCardLayout;
}

export default function ProductCard({
  layout = "carousel",
  ...data
}: ProductCardProps) {
  const navigate = useNavigate();
  const isGrid = layout === "grid";

  const cardSx = {
    width: isGrid ? "100%" : { xs: 220, sm: 240, md: 260 },
    minWidth: isGrid ? "100%" : { xs: 220, sm: 240, md: 260 },
    height: isGrid ? "100%" : { xs: 300, sm: 320, md: 340 },
    border: "1px solid #C2C2C2",
    bgcolor: "#CFCFCF",
    borderRadius: 1,
    overflow: "hidden",
    boxShadow: 1,
    transition: "transform 250ms ease, box-shadow 250ms ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: 4,
    },
  };

  const mediaHeight = isGrid
    ? { xs: 170, sm: 190, md: 210 }
    : { xs: 170, sm: 180, md: 190 };

  return (
    <Card sx={cardSx}>
      <CardActionArea
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        //onClick={() => navigate(`/products/${data.id}`)}
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
              width: 96,
              height: 32,
              borderBottomRightRadius: 1,
              bgcolor: "#C2C2C2",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: isGrid ? "0.75rem" : "0.7rem",
                fontWeight: 500,
              }}
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
              height: mediaHeight,
            }}
          >
            <Typography
              sx={{
                fontSize: isGrid ? "0.95rem" : "0.85rem",
                px: 1,
                textAlign: "center",
              }}
            >
              {data.title}
            </Typography>
          </Box>
        ) : (
          <CardMedia
            component="img"
            image={data.image}
            alt={data.title}
            sx={{ width: "100%", height: mediaHeight, objectFit: "cover" }}
          />
        )}

        <CardContent
          sx={{
            mt: "auto",
            width: "100%",
            bgcolor: "#fff",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <Typography sx={{ fontSize: isGrid ? "0.95rem" : "0.85rem" }} noWrap>
            {data.title}
          </Typography>
          <Typography
            sx={{
              fontSize: isGrid ? "1rem" : "0.95rem",
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
                fontSize: isGrid ? "0.85rem" : "0.8rem",
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
