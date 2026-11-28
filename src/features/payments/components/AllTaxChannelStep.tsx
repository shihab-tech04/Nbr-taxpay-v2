import React from 'react';
import {
  SharedPaymentChannelStep,
  type SharedPaymentChannelStepProps,
} from '../../../components/payments/SharedPaymentChannelStep';

export const AllTaxChannelStep: React.FC<SharedPaymentChannelStepProps> = (props) => (
  <SharedPaymentChannelStep {...props} />
);
