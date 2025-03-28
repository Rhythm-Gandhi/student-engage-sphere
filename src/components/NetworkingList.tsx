
import React from 'react';
import { UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface NetworkingUser {
  id: string;
  name: string;
  major?: string;
  shareProfile: boolean;
}

interface NetworkingListProps {
  users: NetworkingUser[];
  eventTitle: string;
}

export function NetworkingList({ users, eventTitle }: NetworkingListProps) {
  const sharedUsers = users.filter(user => user.shareProfile);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Networking - Who's Attending</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          These people have checked in to {eventTitle} and are open to networking.
        </p>
        
        {sharedUsers.length === 0 ? (
          <div className="text-center py-6">
            <UserIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-40 mb-2" />
            <p className="text-muted-foreground">No one has checked in yet or enabled profile sharing.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {sharedUsers.map((user) => (
              <li key={user.id}>
                <div className="flex items-center py-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <UserIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    {user.major && (
                      <p className="text-sm text-muted-foreground">{user.major}</p>
                    )}
                  </div>
                </div>
                <Separator />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
