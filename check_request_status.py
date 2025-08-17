from requests.models import Request, File

latest = Request.objects.order_by('-created_at').first()
if latest:
    print('ID:', latest.id)
    print('이름:', latest.name)
    print('이메일:', latest.email)
    print('is_temporary:', latest.is_temporary)
    print('생성일:', latest.created_at)
    print('첨부파일 개수:', latest.files.count())
    for f in latest.files.all():
        print('  - 파일명:', f.original_name, '| S3키:', f.file, '| 생성일:', f.created_at)
else:
    print('요청서가 없습니다.') 