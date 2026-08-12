# Google Cloud Scheduler Setup for Sweeper (المكنسة البرمجية)

هذا الملف يحتوي على الإعدادات السرية والتشغيلية الخاصة بربط نقطة نهاية המكنسة البرمجية (`/api/cron/sweeper`) مع خدمة Google Cloud Scheduler لتفادي مشكلة الخمول (Scale-to-Zero).

## الإعدادات المطلوبة (Cloud Scheduler Settings)

```yaml
Target Type: HTTP
URL: https://<your-domain>/api/cron/sweeper
HTTP Method: POST
Auth Header: Add Bearer token
Header Name: Authorization
Header Value: Bearer ${CRON_SECRET}
Frequency: 0 3 * * *
Timezone: UTC
```

> **ملاحظة أمنية هامة:** 
> تأكد من توليد مفتاح سري معقد وطويل ووضعه في المتغير البيئي `CRON_SECRET` في خدمة Cloud Run لضمان تطابق التحقق وتفادي الاستدعاءات الوهمية أو الاختراق.
