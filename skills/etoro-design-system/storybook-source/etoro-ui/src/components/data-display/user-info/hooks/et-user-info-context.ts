import { createInfoContext } from '../../_info-base/context';
import type { EtUserDefaults } from '../api/types';

const { Context: EtUserInfoContext, useInfoContext } = createInfoContext<EtUserDefaults>('EtUserInfo');

export { EtUserInfoContext };
export const useEtUserInfoContext = useInfoContext;
