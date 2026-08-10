import React from 'react';
import { AdoptedChannelSupport, AdoptionDurationPolicy } from '../../services/jasmineService';

export interface DynamicExplainerProps {
  channelName: string;
  supportTypes?: AdoptedChannelSupport['supportTypes'];
  durationPolicy?: AdoptionDurationPolicy;
}

export const DynamicExplainer: React.FC<DynamicExplainerProps> = ({
  channelName,
  supportTypes,
  durationPolicy,
}) => {
  if (!supportTypes && !durationPolicy) return null;

  return (
    <div className="mt-3 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200/90 leading-relaxed">
      <div className="font-semibold mb-1 text-emerald-400 flex items-center gap-1.5">
        <span>💡</span> رؤية التمكين لـ ({channelName}):
      </div>

      {/* الشرح الديناميكي لأنواع الدعم */}
      {supportTypes && (
        <ul className="list-disc list-inside space-y-1 opacity-90 text-[11px]">
          {supportTypes.isGodfather && (
            <li>
              <b>العرّاب:</b> تقديم دعم مادي/معدات لوجستية مباشرة خارج المنظومة.
            </li>
          )}
          {supportTypes.isOrientation && (
            <li>
              <b>التوجيه:</b> دعوة جمهورك ومتابعيك لتشغيل ومتابعة هذه القناة.
            </li>
          )}
          {supportTypes.isMentorship && (
            <li>
              <b>الإرشاد:</b> تقديم نصائح تقنية وتوجيهات لتطوير أداء البث والمحتوى.
            </li>
          )}
          {supportTypes.isCoCreation && (
            <li>
              <b>الإنتاج المشترك:</b> استضافة صانع المحتوى أو مشاركته في بث/فيديو.
            </li>
          )}
        </ul>
      )}

      {/* الشرح الديناميكي لسقف التبني */}
      {durationPolicy && (
        <div className="mt-2 pt-2 border-t border-emerald-500/10 text-emerald-300 text-[11px]">
          <b>سقف مدة التبني: </b>
          {durationPolicy.type === 'SUBSCRIBER_TARGET' && (
            <span>
              ينتهي التبني تلقائياً عند وصول القناة لـ{' '}
              {durationPolicy.subscriberTargetCount?.toLocaleString()} مشترك.
            </span>
          )}
          {durationPolicy.type === 'TIME_BOUND' && (
            <span>تبني زمني لمدة ({durationPolicy.durationMonths}) شهر.</span>
          )}
          {durationPolicy.type === 'MILESTONE_BASED' && (
            <span>
              ينتهي التبني بعد تحقيق المهمة: "{durationPolicy.milestoneDescription}".
            </span>
          )}
          {durationPolicy.type === 'PERMANENT' && (
            <span>كفالة ورعاية مستمرة دون حد زمني (ظروف استثنائية).</span>
          )}
        </div>
      )}
    </div>
  );
};
