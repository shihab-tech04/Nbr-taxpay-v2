import React from 'react';
import {
  SharedPaymentResultStep,
  type SharedPaymentResultStepProps,
} from '../../../components/payments/SharedPaymentResultStep';

export const AllTaxResultStep: React.FC<SharedPaymentResultStepProps> = (props) => (
  <SharedPaymentResultStep {...props} />
);
