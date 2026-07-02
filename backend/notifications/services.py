from typing import Optional
from users.models import User
from .models import Notification


def _create_notification(
    user: User,
    title: str,
    description: str = '',
    notification_type: str = 'push',
    link: Optional[str] = None,
    metadata: Optional[dict] = None,
) -> Notification:
    return Notification.objects.create(
        user=user,
        title=title,
        description=description or None,
        type=notification_type,
        link=link,
        metadata=metadata or {},
        is_read=False,
    )


def notify_user(
    user: User,
    title: str,
    description: str = '',
    notification_type: str = 'push',
    link: Optional[str] = None,
    metadata: Optional[dict] = None,
) -> Notification:
    return _create_notification(user, title, description, notification_type, link, metadata)


def notify_admins(
    title: str,
    description: str = '',
    notification_type: str = 'push',
    link: Optional[str] = None,
    metadata: Optional[dict] = None,
    exclude_user_id=None,
) -> list[Notification]:
    admins = User.objects.filter(role__iexact=User.Role.ADMIN)
    if exclude_user_id:
        admins = admins.exclude(id=exclude_user_id)

    return [
        _create_notification(admin, title, description, notification_type, link, metadata)
        for admin in admins
    ]
