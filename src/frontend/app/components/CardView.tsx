import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import React, { useState } from 'react';
import Question from '../model/question';

type ICardViewProps = Question;
export const CardView: React.FC<ICardViewProps & SxProps<Theme>> = (props) => {
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const apiQuestionUrl = `https://ocky-api.herokuapp.com/q?id=${props.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${apiQuestionUrl}`;
  return (
    <Card sx={{ minWidth: 275, marginTop: 2 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {props.id}
        </Typography>
        <Typography variant="h5" component="div">
          {props.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {props.player}
        </Typography>
        {showQRCode && <img src={qrCodeUrl} alt="new" />}
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            setShowQRCode(!showQRCode);
          }}
        >
          {showQRCode ? 'Dismiss QR Code' : 'Show QR Code'}
        </Button>
      </CardActions>
    </Card>
  );
};
