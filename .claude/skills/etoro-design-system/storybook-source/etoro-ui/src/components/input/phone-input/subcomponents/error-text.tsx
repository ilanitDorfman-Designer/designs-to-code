import { memo } from 'react';

import { EtText } from '../../../../foundations/text/et-text';
import { usePhoneInputContext } from '../contexts';

function ErrorTextBase() {
  const { error, errorTextColor, hasError } = usePhoneInputContext();

  if (!hasError || !error) return null;

  return (
    <EtText variant="body-tiny-regular" style={{ color: errorTextColor }}>
      {error}
    </EtText>
  );
}

ErrorTextBase.displayName = 'EtPhoneInput.ErrorText';

export const ErrorText = memo(ErrorTextBase);
