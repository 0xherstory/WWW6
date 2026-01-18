import { useState, useEffect } from "react";
import { Contract, formatEther } from "ethers";
import { useWalletContext } from "@/contexts/WalletContext";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/lib/contracts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Plus, CheckCircle, Gift } from "lucide-react";

interface EventItem {
  type: "created" | "checkin" | "finalized";
  address: string;
  timestamp: number;
  data?: any;
}

interface Props {
  onNewEvent?: () => void;
}

export function EventLog({ onNewEvent }: Props) {
  const { provider } = useWalletContext();
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    if (!provider) return;

    const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

    const handleCreated = (owner: string, instance: string, value: bigint) => {
      setEvents((prev) => [
        {
          type: "created",
          address: instance,
          timestamp: Date.now(),
          data: { owner, value: formatEther(value) },
        },
        ...prev.slice(0, 49),
      ]);
      onNewEvent?.();
    };

    factory.on("InheritanceCreated", handleCreated);

    return () => {
      factory.off("InheritanceCreated", handleCreated);
    };
  }, [provider, onNewEvent]);

  const getIcon = (type: EventItem["type"]) => {
    switch (type) {
      case "created":
        return <Plus className="h-4 w-4 text-primary" />;
      case "checkin":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "finalized":
        return <Gift className="h-4 w-4 text-primary" />;
    }
  };

  const getLabel = (type: EventItem["type"]) => {
    switch (type) {
      case "created":
        return "新遗产创建";
      case "checkin":
        return "签到";
      case "finalized":
        return "遗产继承";
    }
  };

  if (!provider) return null;

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-display text-xl">
          <Bell className="h-4 w-4 text-primary" />
          LIVE EVENTS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              等待事件...
            </p>
          ) : (
            <div className="space-y-2">
              {events.map((event, i) => (
                <div
                  key={`${event.address}-${event.timestamp}-${i}`}
                  className="flex items-center gap-2 p-2 bg-background/50 rounded-lg text-sm border border-border/30"
                >
                  {getIcon(event.type)}
                  <Badge variant="outline" className="text-xs border-primary/30">
                    {getLabel(event.type)}
                  </Badge>
                  <span className="font-mono text-xs truncate flex-1 text-muted-foreground">
                    {event.address.slice(0, 10)}...
                  </span>
                  {event.data?.value && (
                    <span className="text-xs font-medium text-primary">
                      {event.data.value} ETH
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleTimeString("zh-CN")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
