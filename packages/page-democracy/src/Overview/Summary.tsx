// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

const ZERO = new BN(0);

function Summary (): React.ReactElement<{}> {
  const { t } = useTranslation();
  const { api } = useApi();
  const activeProposals = useCall<any[]>(api.derive.democracy.proposals, []);
  const bestNumber = useCall<BN>(api.derive.chain.bestNumber, []);
  const nextActive = useCall<BN>(api.query.democracy.lowestUnbaked, []);
  const publicPropCount = useCall<BN>(api.query.democracy.publicPropCount, []);
  const referendumCount = useCall<BN>(api.query.democracy.referendumCount, []);

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t('proposals')}>
          {formatNumber(activeProposals?.length)}
        </CardSummary>
        <CardSummary label={t('total')}>
          {formatNumber(publicPropCount)}
        </CardSummary>
      </section>
      <section>
        <CardSummary label={t('referenda')}>
          {formatNumber(referendumCount && nextActive ? referendumCount.sub(nextActive) : ZERO)}
        </CardSummary>
        <CardSummary label={t('total')}>
          {formatNumber(referendumCount)}
        </CardSummary>
      </section>
      {bestNumber && (
        <section className='ui--media-medium'>
          <CardSummary
            label={t('launch period')}
            progress={{
              total: api.consts.democracy.launchPeriod,
              value: bestNumber.mod(api.consts.democracy.launchPeriod).addn(1),
              withTime: true
            }}
          />
        </section>
      )}
    </SummaryBox>
  );
}

export default React.memo(Summary);
