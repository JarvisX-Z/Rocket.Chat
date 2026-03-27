import type { IRoom } from '@rocket.chat/core-typings';
import { isThreadMessage } from '@rocket.chat/core-typings';
import { MessageTypes } from '@rocket.chat/message-types';
import { useSetting, useUserPreference } from '@rocket.chat/ui-contexts';
import type { ComponentProps } from 'react';

import { MessageListItem } from './MessageListItem';
import { useRoomSubscription } from '../contexts/RoomContext';
import { useFirstUnreadMessageId } from '../hooks/useFirstUnreadMessageId';
import { SelectedMessagesProvider } from '../providers/SelectedMessagesProvider';
import { useMessages } from './hooks/useMessages';
import { isMessageSequential } from './lib/isMessageSequential';
import MessageListProvider from './providers/MessageListProvider';

type MessageListProps = {
	rid: IRoom['_id'];
	messageListRef: ComponentProps<typeof MessageListProvider>['messageListRef'];
};

export const MessageList = function MessageList({ rid, messageListRef }: MessageListProps) {
	const messages = useMessages({ rid });
	const { name, roles } = useRoomSubscription();
	const showUserAvatar = !!useUserPreference<boolean>('displayAvatars');
	const messageGroupingPeriod = useSetting('Message_GroupingPeriod', 300);
	const firstUnreadMessageId = useFirstUnreadMessageId();

	return (
		<MessageListProvider messageListRef={messageListRef}>
			<SelectedMessagesProvider>
				{messages.map((message, index) => {
					const previous = index > 0 ? messages[index - 1] : undefined;
					const sequential = previous ? isMessageSequential(message, previous, messageGroupingPeriod) : false;
					const showUnreadDivider = firstUnreadMessageId === message._id;
					const system = MessageTypes.isSystemMessage(message);
					const visible = !isThreadMessage(message) && !system;

					return (
						<div key={message._id} data-index={index}>
							<MessageListItem
								message={message}
								previous={previous}
								showUnreadDivider={showUnreadDivider}
								showUserAvatar={showUserAvatar}
								sequential={sequential}
								visible={visible}
								subscriptionName={name}
								subscriptionRoles={roles}
								system={system}
							/>
						</div>
					);
				})}
			</SelectedMessagesProvider>
		</MessageListProvider>
	);
};
