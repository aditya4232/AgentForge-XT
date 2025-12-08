import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { CheckCircle, AlertCircle, Zap, Loader2, MoreHorizontal } from "lucide-react";
import { getNodeInfo } from "@/lib/workflow-constants";

export const CustomNode = memo(({ data, selected }: NodeProps) => {
    const nodeInfo = getNodeInfo(data.type);
    const Icon = nodeInfo?.icon || Zap;

    return (
        <div
            className={`group min-w-[200px] rounded-xl border-2 bg-card shadow-lg transition-all duration-200 
            ${selected ? "border-violet-500 shadow-violet-500/20 shadow-xl" : "border-border hover:border-violet-500/50"}
            ${data.status === 'running' ? 'ring-2 ring-blue-500/30' : ''}
            `}
        >
            {/* Input Handle - Left side */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-4 !h-4 !-ml-2 !border-4 !border-background !rounded-full !bg-violet-500 hover:!bg-violet-400 hover:!scale-110 transition-all cursor-crosshair"
                style={{ top: '50%' }}
            />

            <div className="flex flex-col">
                {/* Header */}
                <div className="p-3 flex items-center gap-3 relative">
                    {/* Icon Box */}
                    <div className={`
                        h-10 w-10 shrink-0 rounded-lg flex items-center justify-center shadow-md
                        ${nodeInfo?.color || "bg-gradient-to-br from-violet-500 to-purple-600 text-white"}
                    `}>
                        <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-foreground">
                            {data.label || nodeInfo?.label || "Node"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {nodeInfo?.category || data.type}
                        </p>
                    </div>

                    {/* Menu button */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-secondary rounded-md">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Status Indicator */}
                    {data.status && (
                        <div className="absolute -top-2 -right-2">
                            {data.status === "success" && (
                                <div className="bg-green-500 rounded-full p-1 shadow-lg border-2 border-background">
                                    <CheckCircle className="h-3 w-3 text-white" />
                                </div>
                            )}
                            {data.status === "error" && (
                                <div className="bg-red-500 rounded-full p-1 shadow-lg border-2 border-background">
                                    <AlertCircle className="h-3 w-3 text-white" />
                                </div>
                            )}
                            {data.status === "running" && (
                                <div className="bg-blue-500 rounded-full p-1 shadow-lg border-2 border-background">
                                    <Loader2 className="h-3 w-3 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer - always show for context */}
                <div className="px-3 py-2 border-t border-border/50 bg-secondary/20 rounded-b-xl flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        {data.itemsCount ? `${data.itemsCount} items` : "Click to configure"}
                    </span>
                    {data.executionTime && (
                        <span className="text-[10px] text-green-500 font-medium">
                            {data.executionTime}ms
                        </span>
                    )}
                </div>
            </div>

            {/* Output Handle - Right side */}
            <Handle
                type="source"
                position={Position.Right}
                className="!w-4 !h-4 !-mr-2 !border-4 !border-background !rounded-full !bg-violet-500 hover:!bg-violet-400 hover:!scale-110 transition-all cursor-crosshair"
                style={{ top: '50%' }}
            />
        </div>
    );
});

CustomNode.displayName = "CustomNode";

export default CustomNode;
