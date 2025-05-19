package com.booking.controller;

import com.booking.model.Workspace;
import com.booking.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @Autowired
    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @GetMapping
    public List<Workspace> getAllWorkspaces() {
        return workspaceService.getAllWorkspaces();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workspace> getWorkspaceById(@PathVariable Long id) {
        return workspaceService.getWorkspaceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Workspace createWorkspace(@RequestBody Workspace workspace) {
        return workspaceService.createWorkspace(workspace);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Workspace> updateWorkspace(@PathVariable Long id, @RequestBody Workspace workspaceDetails) {
        try {
            Workspace updatedWorkspace = workspaceService.updateWorkspace(id, workspaceDetails);
            return ResponseEntity.ok(updatedWorkspace);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkspace(@PathVariable Long id) {
        try {
            workspaceService.deleteWorkspace(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}