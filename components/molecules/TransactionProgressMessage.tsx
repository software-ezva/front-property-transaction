import React from "react";
import { Clock, LucideIcon } from "lucide-react";

interface TransactionProgressMessageProps {
  type:
    | "no-transactions"
    | "low-progress"
    | "medium-progress"
    | "high-progress"
    | "completed";
  transactionData?: {
    propertyAddress: string;
    completedWorkflowItems: number;
    totalWorkflowItems: number;
    progressPercentage: number;
  };
  completedCount?: number;
  className?: string;
}

const TransactionProgressMessage = ({
  type,
  transactionData,
  completedCount = 0,
  className = "",
}: TransactionProgressMessageProps) => {
  const getMessageConfig = () => {
    switch (type) {
      case "no-transactions":
        return {
          bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50",
          borderColor: "border-blue-200",
          icon: Clock,
          iconColor: "text-blue-600",
          title: "⏳ Your Transaction Assignment is Coming Soon",
          titleColor: "text-blue-900",
          description:
            "We're currently preparing your transaction details and matching you with the perfect agent for your needs.",
          descriptionColor: "text-blue-700",
          highlight:
            "You'll be notified as soon as your transaction is ready. Thank you for your patience!",
          highlightColor: "text-blue-600",
          showProgress: false,
        };

      case "low-progress":
        return {
          bgColor: "bg-gradient-to-r from-yellow-50 to-orange-50",
          borderColor: "border-yellow-200",
          icon: null,
          title: "🏗️ Transaction in Early Stages",
          titleColor: "text-yellow-900",
          description: `${transactionData?.propertyAddress} - We're working hard to get everything set up for you.`,
          descriptionColor: "text-yellow-800",
          subDescription:
            "Your transaction is in the initial preparation phase. Our team is handling all the groundwork to ensure a smooth process ahead.",
          subDescriptionColor: "text-yellow-700",
          highlight:
            "💡 Please be patient while we complete the initial steps. Great things take time!",
          highlightBg: "bg-yellow-100",
          highlightColor: "text-yellow-800",
          progressColor: "text-yellow-600",
          showProgress: true,
        };

      case "medium-progress":
        return {
          bgColor: "bg-gradient-to-r from-blue-50 to-cyan-50",
          borderColor: "border-blue-200",
          icon: null,
          title: "🚀 Great Progress on Your Transaction!",
          titleColor: "text-blue-900",
          description: `${transactionData?.propertyAddress} - We're making excellent progress together.`,
          descriptionColor: "text-blue-800",
          subDescription: `Your transaction is moving along nicely! We've completed ${transactionData?.completedWorkflowItems} out of ${transactionData?.totalWorkflowItems} steps.`,
          subDescriptionColor: "text-blue-700",
          highlight:
            "🎯 We're continuing to work diligently on your behalf. Stay tuned for more updates!",
          highlightBg: "bg-blue-100",
          highlightColor: "text-blue-800",
          progressColor: "text-blue-600",
          showProgress: true,
        };

      case "high-progress":
        return {
          bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
          borderColor: "border-green-200",
          icon: null,
          title: "🏁 Almost There - Final Steps!",
          titleColor: "text-green-900",
          description: `${transactionData?.propertyAddress} - We're in the final stretch!`,
          descriptionColor: "text-green-800",
          subDescription: `Fantastic progress! Only ${
            (transactionData?.totalWorkflowItems || 0) -
            (transactionData?.completedWorkflowItems || 0)
          } step(s) remaining to complete your transaction.`,
          subDescriptionColor: "text-green-700",
          highlight:
            "✨ We're putting the finishing touches on everything. Completion is just around the corner!",
          highlightBg: "bg-green-100",
          highlightColor: "text-green-800",
          progressColor: "text-green-600",
          showProgress: true,
        };

      case "completed":
        return {
          bgColor: "bg-gradient-to-r from-purple-50 to-pink-50",
          borderColor: "border-purple-200",
          icon: null,
          title: `🎉 Congratulations! Transaction${
            completedCount > 1 ? "s" : ""
          } Successfully Completed!`,
          titleColor: "text-purple-900",
          description: `We're thrilled to announce that ${completedCount} of your transaction${
            completedCount > 1 ? "s have" : " has"
          } been successfully completed!`,
          descriptionColor: "text-purple-700",
          highlight:
            "🏆 Thank you for your trust and patience throughout this journey. We hope you're delighted with the outcome!",
          highlightBg: "bg-purple-100",
          highlightColor: "text-purple-800",
          progressColor: "text-purple-600",
          showProgress: false,
          showCompletedCount: true,
        };

      default:
        return null;
    }
  };

  const config = getMessageConfig();
  if (!config) return null;

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Icon for no-transactions type */}
          {config.icon && (
            <config.icon
              className={`w-12 h-12 ${config.iconColor} mx-auto mb-4`}
            />
          )}

          {/* Title */}
          <h3 className={`text-lg font-semibold ${config.titleColor} mb-2`}>
            {config.title}
          </h3>

          {/* Main Description */}
          <p className={`${config.descriptionColor} mb-2`}>
            {config.description}
          </p>

          {/* Sub Description */}
          {config.subDescription && (
            <p className={`${config.subDescriptionColor} text-sm mb-3`}>
              {config.subDescription}
            </p>
          )}

          {/* Highlight Box */}
          <div
            className={`${config.highlightBg || "bg-gray-100"} rounded-lg p-3`}
          >
            <p className={`${config.highlightColor} text-sm font-medium`}>
              {config.highlight}
            </p>
          </div>
        </div>

        {/* Progress Percentage or Completed Count */}
        {config.showProgress && transactionData && (
          <div className="text-right ml-4">
            <div className={`text-2xl font-bold ${config.progressColor}`}>
              {transactionData.progressPercentage}%
            </div>
            <div className={`text-sm ${config.progressColor}`}>Complete</div>
          </div>
        )}

        {config.showCompletedCount && (
          <div className="text-right ml-4">
            <div className={`text-3xl font-bold ${config.progressColor}`}>
              {completedCount}
            </div>
            <div className={`text-sm ${config.progressColor}`}>Completed</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionProgressMessage;
