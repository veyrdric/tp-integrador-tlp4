import { UserModel } from "../users/User.js";
import type { ISubscriberFinder, ISubscriptionRepository, Subscriber } from "./ISubscriptionRepository.js";
import { SubscriptionModel } from "./Subscription.js";

export class SubscriptionRepository implements ISubscriptionRepository, ISubscriberFinder {
  async subscribe(userId: string, bookId: string): Promise<void> {
    await SubscriptionModel.findOrCreate({ where: { userId, bookId } });
  }

  async unsubscribe(userId: string, bookId: string): Promise<boolean> {
    const deleted = await SubscriptionModel.destroy({ where: { userId, bookId } });
    return deleted > 0;
  }

  async isSubscribed(userId: string, bookId: string): Promise<boolean> {
    return (await SubscriptionModel.count({ where: { userId, bookId } })) > 0;
  }

  async findSubscribers(bookId: string): Promise<Subscriber[]> {
    const subscriptions = await SubscriptionModel.findAll({
      where: { bookId },
      include: [{ model: UserModel, as: "user" }],
    });
    return subscriptions
      .filter((s) => s.user)
      .map((s) => ({ userId: s.userId, email: s.user?.email ?? "" }));
  }
}
