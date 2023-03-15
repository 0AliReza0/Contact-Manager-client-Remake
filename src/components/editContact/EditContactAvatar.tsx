"use client";
import { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Skeleton from "@mui/material/Skeleton";
import Image from "next/image";
import { Button, useMediaQuery, useTheme } from "@mui/material";

const EditContactAvatar = ({
  avatarSrc,
  alt,
  imageUploaded,
}: {
  avatarSrc: string | undefined;
  alt: string | undefined;
  imageUploaded: boolean;
}) => {
  const [isLoadingSrc, setIsLoadingSrc] = useState<string | null>();

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  const skeleton = (
    <Skeleton
      variant="circular"
      animation="wave"
      sx={{
        width: {
          xs: 150,
          sm: 200,
          md: 250,
        },
        height: {
          xs: 150,
          sm: 200,
          md: 250,
        },
        m: "0 auto",
      }}
    />
  );

  return (
    <Grid
      xs={12}
      sm={12}
      md={4}
      lg={4}
      p={1}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      {!avatarSrc && skeleton}
      <Image
        priority
        src={avatarSrc!}
        alt={alt!}
        width={500}
        height={500}
        style={{
          display: isLoadingSrc && avatarSrc ? "block" : "none",
          borderRadius: "100%",
          width: isSmDown ? "70%" : "100%",
          height: "auto",
          objectFit: "cover",
          margin: "0 auto",
          aspectRatio: "1 / 1",
        }}
        onLoad={() => {
          setIsLoadingSrc(avatarSrc);
        }}
      />
      {imageUploaded && (
        <Button sx={{ borderRadius: "20px" }}>ثبت عکس پروفایل</Button>
      )}
    </Grid>
  );
};

export default EditContactAvatar;
