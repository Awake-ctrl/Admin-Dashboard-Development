import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

const metrics = [
  {
    title: "Total Users",
    value: "12,345",
    change: "+12%",
    changeType: "positive",
    icon: Users,
  },
  {
    title: "Revenue",
    value: "$54,321",
    change: "+8%",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "1,234",
    change: "-3%",
    changeType: "negative",
    icon: ShoppingCart,
  },
  {
    title: "Growth",
    value: "23.5%",
    change: "+15%",
    changeType: "positive",
    icon: TrendingUp,
  },
];

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-foreground">{metric.value}</div>
            <p className={`text-xs ${
              metric.changeType === 'positive' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {metric.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}