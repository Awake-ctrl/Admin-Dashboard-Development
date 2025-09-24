import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";

const activities = [
  {
    id: 1,
    user: "Alice Johnson",
    action: "Created new user account",
    time: "2 minutes ago",
    type: "user",
    status: "success"
  },
  {
    id: 2,
    user: "Bob Smith",
    action: "Updated product inventory",
    time: "15 minutes ago",
    type: "system",
    status: "info"
  },
  {
    id: 3,
    user: "Carol Davis",
    action: "Processed payment #1234",
    time: "1 hour ago",
    type: "payment",
    status: "success"
  },
  {
    id: 4,
    user: "David Wilson",
    action: "Failed login attempt",
    time: "2 hours ago",
    type: "security",
    status: "warning"
  },
  {
    id: 5,
    user: "Eva Brown",
    action: "Generated monthly report",
    time: "3 hours ago",
    type: "report",
    status: "info"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'bg-green-100 text-green-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'info': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="text-foreground truncate">
                  <span className="text-muted-foreground">{activity.user}</span> {activity.action}
                </p>
                <p className="text-muted-foreground text-xs">{activity.time}</p>
              </div>
              
              <Badge variant="secondary" className={getStatusColor(activity.status)}>
                {activity.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}