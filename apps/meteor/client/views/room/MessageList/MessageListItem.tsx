import React from 'react';
import { isThreadMessage, type IMessage } from '@rocket.chat/core-typings';
import { Box, Bubble, MessageDivider } from '@rocket.chat/fuselage';
import { useTranslation } from 'react-i18next';

import RoomMessage from '../../../components/message/variants/RoomMessage';
import SystemMessage from '../../../components/message/variants/SystemMessage';
import ThreadMessagePreview from '../../../components/message/variants/ThreadMessagePreview';
import { useDateRef } from '../providers/DateListProvider';
import { isMessageNewDay } from './lib/isMessageNewDay';
import { useMessageListFormatDate } from '../../../components/message/list/MessageListContext';

type MessageListItemProps = {
	message: IMessage;
	previous?: IMessage;
	showUnreadDivider: boolean;
	sequential: boolean;
	showUserAvatar: boolean;
	visible: boolean;
	subscriptionName?: string;
	subscriptionRoles?: string[];
	system: boolean;
};

export const MessageListItem = React.memo(
	({
		message,
		previous,
		showUnreadDivider,
		sequential,
		showUserAvatar,
		visible,
		subscriptionName,
		subscriptionRoles,
		system,
	}: MessageListItemProps) => {
		const { t } = useTranslation();
		const formatDate = useMessageListFormatDate();
		const ref = useDateRef();

		const newDay = isMessageNewDay(message, previous);
		const showDivider = newDay || showUnreadDivider;
		const shouldShowAsSequential = sequential && !newDay;

		return (
			<>
				{showDivider && (
					<Box
						ref={ref}
						data-id={message.ts}
						role='listitem'
						{...(newDay && {
							'data-time': new Date(message.ts)
								.toISOString()
								.replaceAll(/[-T:.]/g, '')
								.substring(0, 8),
						})}
					>
						<MessageDivider unreadLabel={showUnreadDivider ? t('Unread_Messages').toLowerCase() : undefined}>
							{newDay && (
								<Bubble small secondary>
									{formatDate(message.ts)}
								</Bubble>
							)}
						</MessageDivider>
					</Box>
				)}
				{visible && (
					<RoomMessage
						message={message}
						showUserAvatar={showUserAvatar}
						sequential={shouldShowAsSequential}
					/>
				)}
				{isThreadMessage(message) && (
					<li>
						<ThreadMessagePreview
							data-mid={message._id}
							data-tmid={message.tmid}
							data-unread={showUnreadDivider}
							data-sequential={sequential}
							sequential={shouldShowAsSequential}
							message={message}
							showUserAvatar={showUserAvatar}
						/>
					</li>
				)}
				{system && <SystemMessage showUserAvatar={showUserAvatar} message={message} />}
			</>
		);
	},
	(prev, next) =>
		prev.message._id === next.message._id &&
		prev.sequential === next.sequential &&
		prev.showUnreadDivider === next.showUnreadDivider &&
		prev.showUserAvatar === next.showUserAvatar &&
		prev.visible === next.visible &&
		prev.system === next.system &&
		prev.subscriptionName === next.subscriptionName &&
		prev.subscriptionRoles === next.subscriptionRoles
);
