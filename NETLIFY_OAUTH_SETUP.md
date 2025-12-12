# Hướng Dẫn Setup Netlify OAuth cho CMS

## Vấn Đề Vừa Gặp

Khi truy cập `/loivao` và đăng nhập, gặp lỗi "Page not found" tại URL:
```
https://soosan24112025.netlify.app/auth?provider=github&site_id=&scope=repo%2Cuser
```

## Nguyên Nhân

Config CMS đang có `site_domain: ""` và `base_url: ""`, khiến authentication callback không hoạt động.

## Giải Pháp Đã Áp Dụng

Đã cập nhật `public/loivao/config.yml`:

```yaml
backend:
  name: github
  repo: Uhshoi1206/soosan24112025
  branch: main
  site_domain: "soosan24112025.netlify.app"
  base_url: "https://api.netlify.com"
```

## Các Bước Setup Hoàn Chỉnh

### Bước 1: Kích Hoạt Netlify Identity

1. Truy cập Netlify Dashboard: https://app.netlify.com
2. Chọn site **soosan24112025**
3. Vào **Site settings** → **Identity**
4. Nhấn **Enable Identity**

### Bước 2: Cấu Hình External Provider (GitHub)

1. Trong trang Identity settings, cuộn xuống **External providers**
2. Nhấn **Add provider**
3. Chọn **GitHub**

### Bước 3: Tạo GitHub OAuth App

1. Truy cập: https://github.com/settings/developers
2. Nhấn **"New OAuth App"**
3. Điền thông tin:

```
Application name: Sveltia CMS - Soosan Motor
Homepage URL: https://soosan24112025.netlify.app
Authorization callback URL: https://api.netlify.com/auth/done
```

4. Nhấn **"Register application"**
5. Sẽ nhận được:
   - **Client ID**: Một chuỗi ký tự dài
   - **Client secrets**: Nhấn "Generate a new client secret"

### Bước 4: Nhập OAuth Credentials vào Netlify

Quay lại Netlify Identity settings:

1. Trong phần **GitHub provider**
2. Nhập:
   - **Client ID** từ GitHub OAuth App
   - **Client Secret** từ GitHub OAuth App
3. Nhấn **Install**

### Bước 5: Cấu Hình Registration (Tùy chọn)

Trong Netlify Identity settings:

1. Vào **Registration preferences**
2. Chọn **Invite only** (khuyến nghị - chỉ admin mới truy cập CMS)
   - Hoặc chọn **Open** nếu muốn cho phép đăng ký tự do

### Bước 6: Mời User (Nếu chọn Invite only)

1. Trong Netlify Identity, chọn tab **"Invite users"**
2. Nhập email của bạn
3. Sẽ nhận email với link kích hoạt
4. Click link và set password

### Bước 7: Deploy và Test

```bash
# Build project
npm run build

# Commit và push
git add .
git commit -m "Configure Netlify OAuth for CMS"
git push

# Netlify sẽ tự động deploy
```

### Bước 8: Truy Cập CMS

1. Sau khi deploy xong, truy cập: https://soosan24112025.netlify.app/loivao
2. Nhấn **"Login with GitHub"**
3. Authorize GitHub permissions
4. Sẽ được redirect về CMS dashboard
5. Bắt đầu quản lý nội dung!

## Xác Minh Setup Thành Công

Sau khi hoàn tất các bước trên, bạn sẽ thấy:

✅ Trang `/loivao` load CMS UI
✅ Nút "Login with GitHub" xuất hiện
✅ Click login → redirect đến GitHub
✅ Authorize → redirect về CMS
✅ Thấy dashboard với 3 collections: Danh Mục, Sản Phẩm, Bài Viết

## Troubleshooting

### Lỗi "Page not found" ở /auth

**Nguyên nhân**: Identity chưa được enable hoặc OAuth chưa được cấu hình

**Giải pháp**:
- Kiểm tra Identity đã enabled chưa
- Kiểm tra GitHub OAuth App callback URL phải là: `https://api.netlify.com/auth/done`

### Lỗi "Invalid client_id"

**Nguyên nhân**: Client ID/Secret không đúng

**Giải pháp**:
- Kiểm tra lại Client ID và Secret từ GitHub
- Re-enter vào Netlify Identity settings

### Lỗi "Cannot read config"

**Nguyên nhân**: File `config.yml` có lỗi syntax

**Giải pháp**:
- Kiểm tra YAML syntax
- Đảm bảo indentation đúng

### Login thành công nhưng không thấy content

**Nguyên nhân**: User chưa có quyền truy cập repo

**Giải pháp**:
- Đảm bảo GitHub account có quyền write vào repo `Uhshoi1206/soosan24112025`
- Kiểm tra scope của OAuth App có bao gồm `repo`

## Cấu Trúc Hoàn Chỉnh

Sau khi setup xong, quy trình hoạt động như sau:

```
1. User vào /loivao
2. Click "Login with GitHub"
3. Netlify Identity xử lý OAuth flow
4. GitHub authorize
5. Netlify trả về token
6. Sveltia CMS sử dụng token để:
   - Đọc content từ repo
   - Tạo/sửa/xóa files
   - Commit và push changes
7. Netlify auto-deploy sau mỗi commit
8. Website cập nhật với nội dung mới
```

## Quyền Hạn và Bảo Mật

### GitHub Permissions

OAuth App yêu cầu:
- `repo` - Để read/write repository
- `user` - Để xác định user identity

### Netlify Identity

- Admin có full access vào CMS
- Mỗi change tạo Git commit với tên user
- Audit trail đầy đủ trong Git history

### Best Practices

1. ✅ Sử dụng "Invite only" registration
2. ✅ Chỉ mời trusted users
3. ✅ Review Git commits thường xuyên
4. ✅ Backup repository định kỳ
5. ✅ Sử dụng branch protection rules nếu có team lớn

## Files Đã Cập Nhật

- ✅ `public/loivao/config.yml` - Thêm site_domain và base_url
- ✅ `NETLIFY_OAUTH_SETUP.md` - Hướng dẫn này

## Next Steps

1. ⏳ Enable Netlify Identity
2. ⏳ Create GitHub OAuth App
3. ⏳ Configure OAuth in Netlify
4. ⏳ Invite users (if using Invite only)
5. ⏳ Deploy changes
6. ⏳ Test CMS login
7. ✅ Start managing content!

---

**Lưu ý**: Sau khi hoàn tất setup, hãy test thử:
1. Thêm một sản phẩm mới
2. Edit một bài viết
3. Toggle visibility của một category
4. Kiểm tra Git commits có xuất hiện
5. Verify website cập nhật sau khi build

Nếu gặp bất kỳ vấn đề nào, check Netlify Deploy logs và Git commit history để debug.
