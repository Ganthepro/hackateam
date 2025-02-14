namespace hackateam.Services;

public class FileService
{
    public enum FolderName
    {
        Avatar,
        Teams
    }

    public FileStream Get(string fileName, FolderName folderName)
    {
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folderName.ToString(), fileName);
        return new FileStream(filePath, FileMode.Open);
    }

    public async Task<string?> UploadFile(string fileName, IFormFile file, FolderName folderName)
    {
        if (file == null || file.Length == 0)
        {
            return null;
        }
        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folderName.ToString());

        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }

        var filePath = Path.Combine(folderPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return fileName;
    }

    public void DeleteFile(string fileName, FolderName folderName)
    {
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folderName.ToString(), fileName);
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
    }

    public async Task<string?> UpdateFile(string fileName, FolderName folderName, IFormFile file)
    {
        DeleteFile(fileName, folderName);
        return await UploadFile(fileName, file, folderName);
    }
}