import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../../../core/hooks/use-etoro-theme';
import { X1, X2, X3, X9 } from '../../../../../../core/styles/spacing';
import { EtText } from '../../../../../../foundations/text/et-text';
import { EtAvatar } from '../../../../avatar/et-avatar';
import { usePollVoterData } from '../hooks/use-poll-voter-data';

/**
 * EtPoll.VoterAvatars - Displays voter avatars (max 3) with additional count
 * Purely presentational - business logic in usePollVoterData hook
 */
function PollVoterAvatarsComponent() {
  const { colors } = useEtoroTheme();
  const { t } = useTranslation('feed');
  const { visibleAvatars, additionalVotersCount, shouldRender } = usePollVoterData();

  if (!shouldRender) {
    return null;
  }

  return (
    <View style={styles.votersSection}>
      {/* Avatar group */}
      {visibleAvatars.length > 0 && (
        <View style={[styles.avatarGroup, { backgroundColor: colors.cardDefault }]}>
          {visibleAvatars.map((avatarUrl, index) => (
            <View key={`avatar-${index}`} style={index < visibleAvatars.length - 1 ? styles.avatarWrapperOverlap : styles.avatarWrapper}>
              <EtAvatar size="small" shape="circle">
                <EtAvatar.Image src={avatarUrl} />
                <EtAvatar.Fallback>
                  <EtText variant="label-tertiary-regular">?</EtText>
                </EtAvatar.Fallback>
              </EtAvatar>
            </View>
          ))}
        </View>
      )}

      {/* Additional voters text */}
      {additionalVotersCount > 0 && (
        <EtText variant="label-tertiary-regular" style={{ color: colors.carbon900 }}>
          {t('poll.otherVoters', { count: additionalVotersCount })}
        </EtText>
      )}
    </View>
  );
}

export const PollVoterAvatars = memo(PollVoterAvatarsComponent);
PollVoterAvatars.displayName = 'EtPoll.VoterAvatars';

const styles = StyleSheet.create({
  votersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X1,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: X9,
    paddingLeft: X1,
    paddingRight: X3,
    paddingVertical: X1,
    height: 32,
  },
  avatarWrapper: {
    borderRadius: 60,
    overflow: 'hidden',
  },
  avatarWrapperOverlap: {
    borderRadius: 60,
    overflow: 'hidden',
    marginRight: -X2,
  },
});
