import React from 'react';
import { Pagination as SuiPagination } from 'semantic-ui-react';

import { AccountId, AccountIndex, Address } from '@polkadot/types';
import AddressMini from '@polkadot/ui-app/AddressMiniJoy';
import { Options } from '@polkadot/ui-api/with/types';
import { queryToProp } from '@polkadot/joy-utils/index';
import { SubmittableResult } from '@polkadot/api';
import { CommentId, PostId, BlogId, IpfsData } from './types';

export const host = 'http://localhost:3001/v1';

export const queryBlogsToProp = (storageItem: string, paramNameOrOpts?: string | Options) => {
  return queryToProp(`query.blogs.${storageItem}`, paramNameOrOpts);
};

type AuthorPreviewProps = {
  address: AccountId | AccountIndex | Address | string
};

// TODO show member instead of address.
export function AuthorPreview ({ address }: AuthorPreviewProps) {
  return (
    <AddressMini value={address} isShort={false} isPadded={false} withBalance={true} withName={true} withMemo={false} size={36} />
  );
}

type PaginationProps = {
  currentPage?: number,
  totalItems: number,
  itemsPerPage?: number,
  onPageChange: (activePage?: string | number) => void
};

export const Pagination = (p: PaginationProps) => {
  const { currentPage = 1, itemsPerPage = 20 } = p;
  const totalPages = Math.floor(p.totalItems / itemsPerPage);

  return totalPages <= 1 ? null : (
    <SuiPagination
      firstItem={null}
      lastItem={null}
      defaultActivePage={currentPage}
      totalPages={totalPages}
      onPageChange={(_event, { activePage }) => p.onPageChange(activePage)}
    />
  );
};

export function getNewIdFromEvent<IdType extends BlogId | PostId | CommentId>
  (_txResult: SubmittableResult): IdType | undefined {

  let id: IdType | undefined;

  _txResult.events.find(event => {
    const { event: { data, method } } = event;
    if (method.indexOf(`Created`) >= 0) {
      const [/* owner */, newId ] = data.toArray();
      id = newId as IdType;
      return true;
    }
    return false;
  });

  return id;
}

export type UrlHasIdProps = {
  match: {
    params: {
      id: string
    }
  }
};

export type UrlHasAddressProps = {
  match: {
    params: {
      address: string
    }
  }
};

type HasAccountIdProps = {
  id: AccountId
};

export function withIdFromMyAddress <Props extends HasAccountIdProps> (Component: React.ComponentType<Props>) {
  return function (props: UrlHasAddressProps) {
    const { match: { params: { address } } } = props;
    try {
      return <Component id={new AccountId(address)} {...props} />;
    } catch (err) {
      return <em>Invalid address: {address}</em>;
    }
  };
}