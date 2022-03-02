import Reddit from "@mui/icons-material/Reddit";
import Telegram from "@mui/icons-material/Telegram";
import Twitter from "@mui/icons-material/Twitter";
import {
  default as FacebookOutlined,
  default as WhatsappOutlined,
} from "@mui/icons-material/WhatsappOutlined";
import Grid from "@mui/material/Grid";
import React from "react";
import FacebookShareButton from "react-share/lib/FacebookShareButton";
import RedditShareButton from "react-share/lib/RedditShareButton";
import TelegramShareButton from "react-share/lib/TelegramShareButton";
import TwitterShareButton from "react-share/lib/TwitterShareButton";
import WhatsappShareButton from "react-share/lib/WhatsappShareButton";

interface Props {
  shareURL: string;
  shareTitle: string;
}

export default function ShareReviewButtons({ shareURL, shareTitle }: Props) {
  return (
    <>
      <Grid item xs>
        <TelegramShareButton url={shareURL} title={shareTitle}>
          <Telegram />
        </TelegramShareButton>
      </Grid>
      <Grid item xs>
        <WhatsappShareButton url={shareURL} title={shareTitle} separator=" ">
          <WhatsappOutlined />
        </WhatsappShareButton>
      </Grid>
      <Grid item xs>
        <TwitterShareButton url={shareURL} title={shareTitle}>
          <Twitter />
        </TwitterShareButton>
      </Grid>
      <Grid item xs>
        <FacebookShareButton url={shareURL} quote={shareTitle}>
          <FacebookOutlined />
        </FacebookShareButton>
      </Grid>
      <Grid item xs>
        <RedditShareButton
          url={shareURL}
          title={shareTitle}
          windowWidth={660}
          windowHeight={460}
        >
          <Reddit />
        </RedditShareButton>
      </Grid>
    </>
  );
}
