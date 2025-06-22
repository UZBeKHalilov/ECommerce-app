import { Injectable, inject } from "@angular/core"
import { AdminService } from "./admin.service"
import { AdminMockService } from "./admin-mock.service"

// You can set this to false when you have a real API
const USE_MOCK_SERVICE = true

@Injectable({
  providedIn: "root",
})
export class AdminServiceProvider {
  private adminService = inject(AdminService)
  private adminMockService = inject(AdminMockService)

  getService() {
    return USE_MOCK_SERVICE ? this.adminMockService : this.adminService
  }
}
