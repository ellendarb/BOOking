package com.booking.service;

import com.booking.model.Workspace;
import com.booking.repository.WorkspaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;

    @Autowired
    public WorkspaceService(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    public List<Workspace> getAllWorkspaces() {
        return workspaceRepository.findAll();
    }

    public Optional<Workspace> getWorkspaceById(Long id) {
        return workspaceRepository.findById(id);
    }

    public Workspace createWorkspace(Workspace workspace) {
        return workspaceRepository.save(workspace);
    }

    public Workspace updateWorkspace(Long id, Workspace workspaceDetails) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workspace not found with id: " + id));

        workspace.setName(workspaceDetails.getName());
        workspace.setDescription(workspaceDetails.getDescription());
        workspace.setAvailable(workspaceDetails.isAvailable());
        workspace.setLocation(workspaceDetails.getLocation());

        return workspaceRepository.save(workspace);
    }

    public void deleteWorkspace(Long id) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workspace not found with id: " + id));
        workspaceRepository.delete(workspace);
    }
}