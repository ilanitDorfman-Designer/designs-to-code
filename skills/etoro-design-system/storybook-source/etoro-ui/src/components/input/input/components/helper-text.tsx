import { StyleSheet, View } from 'react-native';

import { EtText } from '../../../../foundations/text';

interface HelperTextProps {
  text?: string;
  isError: boolean;
  color: string;
  testID?: string;
  charCounter?: {
    current: number;
    max: number;
  };
}

export function HelperText({ text, color, testID, charCounter }: HelperTextProps) {
  const counterTestID = testID ? `${testID}-counter` : undefined;

  return (
    <View style={styles.container}>
      {text && (
        <EtText variant="body-tiny-regular" testID={testID} style={[styles.text, { color }]}>
          {text}
        </EtText>
      )}
      {!text && charCounter && <View style={styles.spacer} />}
      {charCounter && (
        <EtText variant="body-tiny-regular" testID={counterTestID} style={[styles.counter, { color }]}>
          {charCounter.current} / {charCounter.max}
        </EtText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  spacer: {
    flex: 1,
  },
  text: {
    fontSize: 12,
    lineHeight: 18,
  },
  counter: {
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 30,
  },
});
