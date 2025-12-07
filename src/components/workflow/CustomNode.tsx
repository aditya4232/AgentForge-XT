import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { CheckCircle, AlertCircle, Zap, Loader2, MoreHorizontal } from "lucide-react";
import { getNodeInfo } from "@/lib/workflow-constants";

export const CustomNode = memo(({ data, selected }: NodeProps) => {
    const nodeInfo = getNodeInfo(data.type);
    const Icon = nodeInfo?.icon || Zap;

    return (
        <div
            className={`group min-w-[240px] rounded-xl border bg-card shadow-sm transition-all duration-200 
            ${selected ? "border-primary ring-1 ring-primary shadow-md" : "border-border hover:border-primary/50"}
            ${data.status === 'running' ? 'ring-2 ring-blue-500/20' : ''}
            `}
        >
            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Left}
                className="!bg-muted-foreground !w-3 !h-3 !-ml-1.5 !border-2 !border-background hover:!bg-primary transition-colors"
            />

            <div className="flex flex-col">
                {/* Header */}
                <div className="p-3 flex items-start gap-3 relative">
                    {/* Icon Box */}
                    <div className={`
                        h-10 w-10 shrink-0 rounded-lg flex items-center justify-center shadow-sm 
                        ${nodeInfo?.color || "bg-secondary text-foreground"}
                    `}>
                        <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold truncate text-foreground">
                                {nodeInfo?.label || "Node"}
                            </p>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1 hover:bg-secondary rounded">
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground truncate font-medium">
                            {data.label}
                        </p>
                    </div>

                    {/* Status Indicator */}
                    {data.status && (
                        <div className="absolute -top-1 -right-1">
                            {data.status === "success" && (
                                <div className="bg-green-500 rounded-full p-0.5 shadow-sm border border-background">
                                    <CheckCircle className="h-3.5 w-3.5 text-white" />
                                </div>
                            )}
                            {data.status === "error" && (
                                <div className="bg-red-500 rounded-full p-0.5 shadow-sm border border-background">
                                    <AlertCircle className="h-3.5 w-3.5 text-white" />
                                </div>
                            )}
                            {data.status === "running" && (
                                <div className="bg-blue-500 rounded-full p-0.5 shadow-sm border border-background">
                                    <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer/Details */}
                {(data.itemsCount !== undefined || data.description) && (
                    <div className="px-3 py-2 border-t border-border/50 bg-secondary/30 rounded-b-xl flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            {data.itemsCount ? `${data.itemsCount} items` : (nodeInfo?.category || "Node")}
                        </span>
                        {data.executionTime && (
                            <span className="text-[10px] text-muted-foreground">
                                {data.executionTime}ms
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-muted-foreground !w-3 !h-3 !-mr-1.5 !border-2 !border-background hover:!bg-primary transition-colors"
            />
        </div>
    );
});

export default CustomNode;
