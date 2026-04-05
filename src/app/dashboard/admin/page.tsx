import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Briefcase, TrendingUp, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const users = [
    { id: 1, name: "Abebe Kebede", email: "abebe@example.com", joined: "2023-10-01", apps: 12 },
    { id: 2, name: "Sara Tefera", email: "sara@example.com", joined: "2023-10-15", apps: 5 },
    { id: 3, name: "Daniel Tesfaye", email: "daniel@example.com", joined: "2023-11-01", apps: 20 },
    { id: 4, name: "Hirut Bekele", email: "hirut@example.com", joined: "2023-11-05", apps: 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Admin Console</h1>
          <p className="text-muted-foreground">Platform oversight and system analytics.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Users", value: "1,248", icon: Users, trend: "+12%" },
          { label: "Active Jobs", value: "452", icon: Briefcase, trend: "+5%" },
          { label: "AI Requests", value: "12,401", icon: TrendingUp, trend: "+24%" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-500 font-bold">{stat.trend} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Registered Users</CardTitle>
          <CardDescription>Latest user signups and their activity levels.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.joined}</TableCell>
                  <TableCell className="font-medium">{user.apps}</TableCell>
                  <TableCell>
                    <Badge variant={user.apps > 10 ? "default" : "secondary"}>
                      {user.apps > 10 ? "Power User" : "Active"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}